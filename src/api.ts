// import Router from "@koa/router";
// import zodRouter from "koa-zod-router";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { z, ZodError } from "zod";
import * as steam from "./steam-api/steam.js";
import type { Context, Next } from "koa";
import { ValidationError } from "./utils.js";
import { SteamID64Schema } from "./steam-api/schema.js";
// import type { Context, Next } from "koa";

async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    console.log(err);

    let errorBody: { [key: string]: object } = {};
    if (err instanceof ZodError) {
      errorBody.errors = err.errors.map((err) => {
        return { code: err.code, message: err.message };
      });
    } else if (err instanceof ValidationError) {
      ctx.status = 400;
      errorBody.errors = { code: err.code, message: err.message };
    } else {
      ctx.status = 500;
      errorBody.errors = { code: "unknown", message: "Unknown Error" };
      console.log(err);
    }
    ctx.body = errorBody;
  }
}

async function cheekyMiddleware(ctx: Context, next: Next) {
  ctx.set({ "X-Made-You-Look": "You Just Lost The Game" });
  await next();
}

export const router = new Router();
router.prefix("/api");
router.use(errorHandler);
router.use(bodyParser());
router.use(cheekyMiddleware);

// TODO: make another handler to turn the errors into something nicer looking :3

const vanityReqSchema = z.object({
  id: z
    .string()
    .min(3, "Custom URL name too short")
    .max(32, "Custom URL name too long"),
});
router.get("/id", async (ctx, next) => {
  console.log(ctx.request);
  const { id } = vanityReqSchema.parse(ctx.request.body);
  let steamid = await steam.resolveVanity(id);
  ctx.body = { steamid };
});

// TODO: how is this going to work? maybe when I'm less tired...
const friendsSchema = z.object({
  steamids: z.string().array(),
  // .nonempty("Hey man put stuff in ur array pls tysm :3"),
});
router.get("/friends", async (ctx, next) => {
  console.log(ctx.request.body);
  const { steamids } = friendsSchema.parse(ctx.request.body);
  const parsedIds: { [key: string]: object } = {};

  for (let id of steamids) {
    try {
      let parseResult = SteamID64Schema.parse(id);
      let friendResult = await steam.getFriends(parseResult);
      parsedIds[id] = { success: true, friends: friendResult };
    } catch (err) {
      if (err instanceof ZodError) {
        parsedIds[id] = {
          success: false,
          errors: err.errors.map((err) => {
            return { code: err.code, message: err.message };
          }),
        };
      } else {
        parsedIds[id] = {
          success: false,
          errors: [{ code: "unk", error: "Unknown parsing error" }],
        };
      }
    }
  }
  ctx.body = { steamids: parsedIds };
});
