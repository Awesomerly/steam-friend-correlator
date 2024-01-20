import SteamID from "steamid";
import "dotenv/config";

const key = process.env.STEAMAPI_KEY;

let isEmpty = (obj) => Object.keys(obj).length === 0;

// TODO: add proper error stuff to this

export async function resolveVanity(vanity) {
  let url = new URL(
    "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/",
  );
  url.searchParams.append("key", key);
  url.searchParams.append("vanityurl", vanity);

  let resp = await fetch(url)
    .then((resp) => resp.json())
    .catch((err) => {
      throw new Error("Unable to resolve vanity url");
    });
  if (isEmpty(resp)) {
    throw new Error("No response in body");
  }
  resp = resp.response;
  if (resp.success === 42) {
    throw new Error("Vanity url has no matches");
  }
  console.log(resp);

  return resp.steamid;
}

export async function getFriends(id) {
  console.log(`Doing ${id}`);
  let createdId = new SteamID(id);
  if (createdId.isValidIndividual() === false) {
    throw Error("Invalid Steam ID");
  }
  let id64 = createdId.getSteamID64();

  let url = new URL(
    "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/",
  );

  url.searchParams.append("key", key);
  url.searchParams.append("steamid", id64);
  url.searchParams.append("relationship", "friend");

  let resp = await fetch(url)
    .then((resp) => resp.json())
    .catch((err) => {
      throw new Error("Unable to parse json response");
    });

  // console.log(resp);

  if (isEmpty(resp)) {
    throw new Error("User does not have public friends");
  }
  // what to do with friends_since??
  let friends = resp.friendslist.friends.map((friend) => friend.steamid);
  return friends;
}
