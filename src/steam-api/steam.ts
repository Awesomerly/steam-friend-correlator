import { ValidationError } from '../utils.js';
import 'dotenv/config';
import * as schema from './schema.js';
import * as utils from '../utils.js';

const apiUrl = 'http://api.steampowered.com/ISteamUser';

// TODO: does this work??? and how do i make it NOT LOOK SHIT
const key: string =
  process.env.STEAMAPI_KEY ??
  (() => {
    throw new Error('Steam API Key not specified in .env :(');
  })();

export async function resolveVanity(vanity: string): Promise<string> {
  let url = new URL(apiUrl + '/ResolveVanityURL/v0001/');
  url.searchParams.append('key', key);
  url.searchParams.append('vanityurl', vanity);

  let resp = await utils.zodFetch(url, schema.VanityResponseSchema);

  return resp.response.steamid;
}

export async function getFriends(id: string): Promise<Array<string>> {
  let id64 = schema.SteamID64Schema.parse(id);

  let url = new URL(apiUrl + '/GetFriendList/v0001/');
  url.searchParams.append('key', key);
  url.searchParams.append('steamid', id64);
  url.searchParams.append('relationship', 'friend');

  let resp = await utils.zodFetch(url, schema.FriendsResponseSchema);

  // TODO: do something with friends_since
  let friends = resp.friendslist.friends;
  return friends.map((friend) => friend.steamid);
}

// TODO: figure out type annotation
export async function getUserSummaries(idArr: Array<string>) {
  if (idArr.length > 100) {
    throw new ValidationError(
      'invalid_data',
      "YOU CAN'T HAVE MORE THAN 100 NAMES BLAHHHH!!! BECAUSE I SAID SO!!!"
    );
  }

  let id64Arr = schema.SteamID64Schema.array().parse(idArr);

  let url = new URL(apiUrl + '/GetPlayerSummaries/v2/');

  url.searchParams.append('key', key);
  url.searchParams.append('steamids', id64Arr.join(','));

  let resp = await utils.zodFetch(url, schema.UserSummaryResponseSchema);

  return resp.response.players;
}
