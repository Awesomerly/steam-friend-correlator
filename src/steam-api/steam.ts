import { ValidationError } from "../error.js";
import "dotenv/config";
import * as schema from "./schema.js";

const apiUrl = "http://api.steampowered.com/ISteamUser";

// TODO: does this work??? and how do i make it NOT LOOK SHIT
const key: string =
  process.env.STEAMAPI_KEY ??
  (() => {
    throw new Error("Steam API Key not specified in .env :(");
  })();

// TODO: add proper error stuff to this

export async function resolveVanity(vanity: string) {
  let url = new URL(apiUrl + "/ResolveVanityURL/v0001/");
  url.searchParams.append("key", key);
  url.searchParams.append("vanityurl", vanity);

  let resp = await fetch(url)
    .then((resp) => resp.json())
    .catch(() => {
      throw new ValidationError(400, "The vanity string is invalid");
    });

  let validated = schema.VanityResponseSchema.parse(resp);

  return validated.response.steamid;
}

export async function getFriends(id: string) {
  let id64 = schema.SteamID64Schema.parse(id);

  let url = new URL(apiUrl + "/GetFriendList/v0001/");
  url.searchParams.append("key", key);
  url.searchParams.append("steamid", id64);
  url.searchParams.append("relationship", "friend");

  let resp = await fetch(url)
    .then((resp) => resp.json())
    .catch(() => {
      throw new ValidationError(400, "Unable to parse json response");
    });
  let validated = schema.FriendsResponseSchema.parse(resp);

  // TODO: do something with friends_since
  let friends = validated.friendslist.friends.map((friend) => friend.steamid);
  return friends;
}

export async function getUserSummaries(idArr: Array<string>) {
  if (idArr.length > 100) {
    throw new ValidationError(
      400,
      "YOU CAN'T HAVE MORE THAN 100 NAMES BLAHHHH!!! BECAUSE I SAID SO!!!",
    );
  }

  // let IdArrSchema = z.array(schema.SteamID64Schema);

  let id64Arr = schema.SteamID64Schema.array().parse(idArr);

  let url = new URL(apiUrl + "/GetPlayerSummaries/v2/");

  url.searchParams.append("key", key);
  url.searchParams.append("steamids", id64Arr.join(","));

  let resp = await fetch(url)
    .then((resp) => resp.json())
    .catch(() => {
      throw new ValidationError(400, "Unable to parse json response");
    });
  let validated = schema.UserSummarySchema.parse(resp).response.players;
  let obj: { [key: string]: object } = {};
  validated.forEach((entry) => {
    obj[entry.steamid] = entry;
  });

  return obj;
}
