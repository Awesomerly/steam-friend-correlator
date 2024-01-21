import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { z, ZodError } from "zod";
import * as steam from "./steam-api/steam.js";
import type { Context, Next } from "koa";
import { ValidationError } from "./utils.js";
import * as schema from "./steam-api/schema.js";

async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    console.log(err);

    let errorBody: { [key: string]: object } = {};
    if (err instanceof ZodError) {
      errorBody.errors = err.errors.map((err) => {
        return { code: err.code, message: err.message, path: err.path };
      });
    } else if (err instanceof ValidationError) {
      ctx.status = 400;
      errorBody.errors = { code: err.code, message: err.message };
    } else if (err instanceof Error) {
      ctx.status = 400;
      errorBody.errors = { code: "unk", message: err.message };
    } else {
      ctx.status = 500;
      errorBody.errors = { code: "unk", message: "Unknown Error" };
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

const vanityReqSchema = z.object({
  id: z
    .string()
    .min(3, "Custom URL name too short")
    .max(32, "Custom URL name too long"),
});
router.get("/id", async (ctx, next) => {
  const { id } = vanityReqSchema.parse(ctx.request.body);
  let steamid = await steam.resolveVanity(id);
  ctx.body = { steamid };
});

const idListSchema = z.object({
  steamids: schema.SteamID64Schema.array().nonempty(),
});
router.get("/friends", async (ctx, next) => {
  const { steamids } = idListSchema.parse(ctx.request.body);
  const parsedIds: Array<object> = [];

  for (let id of steamids) {
    try {
      let parseResult = schema.SteamID64Schema.parse(id);
      let friendResult = await steam.getFriends(parseResult);
      parsedIds.push({ success: true, friends: friendResult });
    } catch (err) {
      if (err instanceof ZodError) {
        parsedIds.push({
          success: false,
          errors: err.errors.map((err) => {
            return { code: err.code, message: err.message };
          }),
        });
      } else {
        parsedIds.push({
          success: false,
          errors: [{ code: "unk", error: "Unknown parsing error" }],
        });
      }
    }
  }
  ctx.body = { steamids: parsedIds };
});

router.get("/summaries", async (ctx, next) => {
  const { steamids } = idListSchema.parse(ctx.request.body);

  let summaryResult = await steam.getUserSummaries(steamids);

  ctx.body = { summaries: summaryResult };
});
