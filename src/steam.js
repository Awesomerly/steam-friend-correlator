import SteamID from "steamid";
import { ValidationError } from "./error.js";
import "dotenv/config";

const key = process.env.STEAMAPI_KEY;
const apiUrl = "http://api.steampowered.com/ISteamUser";

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function parseSteamId(id) {
  let createdId = new SteamID(id);
  if (createdId.isValidIndividual() === false) {
    throw ValidationError(400, "Invalid Steam ID");
  }
  return createdId.getSteamID64();
}

// TODO: add proper error stuff to this

export async function resolveVanity(vanity) {
  let url = new URL(apiUrl + "/ResolveVanityURL/v0001/");
  url.searchParams.append("key", key);
  url.searchParams.append("vanityurl", vanity);

  let resp = await fetch(url)
    .then((resp) => resp.json())
    .catch((err) => {
      throw new ValidationError(400, "JSON Error");
    });
  if (isEmpty(resp)) {
    throw new ValidationError(400, "Invalid vanity input");
  }
  resp = resp.response;
  if (resp.success === 42) {
    // TODO: should this be error
    throw new ValidationError(400, "Vanity url has no matches");
  }

  return resp.steamid;
}

export async function getFriends(id) {
  let id64 = parseSteamId(id);

  let url = new URL(apiUrl + "/GetFriendList/v0001/");
  url.searchParams.append("key", key);
  url.searchParams.append("steamid", id64);
  url.searchParams.append("relationship", "friend");

  let resp = await fetch(url)
    .then((resp) => resp.json())
    .catch((err) => {
      throw new ValidationError(400, "Unable to parse json response");
    });

  if (isEmpty(resp)) {
    throw new ValidationError("User does not have public friends");
  }
  // TODO: do something with friends_since
  let friends = resp.friendslist.friends.map((friend) => friend.steamid);
  return friends;
}

export async function getUserSummaries(idArr) {
  if (idArr.length > 100) {
    throw ValidationError(400, "NO!!! BECAUSE I SAID SO!!!");
  }

  let id64Arr = idArr.map((id) => parseSteamId(id));

  let url = new URL(apiUrl + "/GetPlayerSummaries/v2/");

  url.searchParams.append("key", key);
  url.searchParams.append("steamids", idArr);

  let resp = await fetch(url)
    .then((resp) => resp.json())
    .catch((err) => {
      throw new ValidationError(400, "Unable to parse json response");
    });

  return resp.response.players;
}
