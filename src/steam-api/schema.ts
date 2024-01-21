import { z } from "zod";
import SteamID from "steamid";
import { isEmpty } from "../utils.js";

// TODO: catch steam id error
export const SteamID64Schema = z
  .string()
  .refine((str) => new SteamID(str).isValidIndividual())
  .transform((str) => new SteamID(str).getSteamID64());

// TODO: figure out what to put in zod error codes:
export const VanityResponseSchema = z.object({
  response: z
    .object({
      steamid: z.string({
        required_error: "Vanity name search unsuccessful",
      }),
    })
    .refine((obj) => !isEmpty(obj), {
      message: "Invalid vanity input",
    }),
});

export const FriendsResponseSchema = z.object({
  friendslist: z
    .object({
      friends: z
        .object({
          steamid: z.string(),
          relationship: z.string(),
          friend_since: z.number(),
        })
        .array(),
    })
    .refine((obj) => !isEmpty(obj), {
      message: "User does not have public friends.",
    }),
});

export const UserSummaryResponseSchema = z.object({
  response: z.object({
    players: z
      .object({
        steamid: z.string(),
      })
      .passthrough()
      .array(),
  }),
});
