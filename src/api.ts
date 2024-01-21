// import Router from "@koa/router";
import zodRouter from "koa-zod-router";
import { z } from "zod";
import * as steam from "./steam-api/steam.js";
import { SteamID64Schema } from "./steam-api/schema.js";

export const router = zodRouter({
  zodRouter: { exposeRequestErrors: true, exposeResponseErrors: true },
});
router.prefix("/api");

// TODO: make another handler to turn the errors into something nicer looking :3

const vanityReqSchema = z.object({
  id: z
    .string()
    .min(3, "Custom URL name too short")
    .max(32, "Custom URL name too long"),
});

router.get(
  "/id",
  async (ctx, next) => {
    const { id } = ctx.request.body;
    let steamid = await steam.resolveVanity(id);
    ctx.body = { steamid };
  },
  { body: vanityReqSchema },
);

// TODO: how is this going to work? maybe when I'm less tired...
const friendsSchema = z.object({
  steamids: z
    .string()
    .array()
    .nonempty("Hey man put stuff in ur array pls tysm :3"),
});
router.get(
  "/friends",
  async (ctx, next) => {
    const { steamids } = ctx.request.body;
    // const parsedIds: { [key: string]: string } = {};
    // steamids.forEach((id) => parsedIds[entry]);
    ctx.body = { steamids };
  },
  { body: friendsSchema },
);
