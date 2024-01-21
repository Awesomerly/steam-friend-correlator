import { z } from "zod";
import SteamID from "steamid";

const isEmpty = (obj: object | {}) => {
  return Object.keys(obj).length === 0;
};

// TODO: add some messenges here
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

export type VanityResponse = z.infer<typeof VanityResponseSchema>;

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

export const UserSummarySchema = z.object({
  response: z.object({
    players: z
      .object({
        steamid: z.string(),
      })
      // zzzz honk mimimimiimmimi so lazyyy
      .passthrough()
      .array(),
  }),
});
