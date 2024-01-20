import Koa from "koa";
import { getFriends, resolveVanity, getUserSummaries } from "./steam.js";

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = "Hello World!";
});

app.listen(3000);

// let counts = {};
// let blah = await resolveVanity("change-name");
// let targetList = [blah];

// for (let targetId of targetList) {
//   let friends = await getFriends(targetId);

//   friends.forEach((id) => {
//     counts[id] ? counts[id]++ : (counts[id] = 1);
//   });
// }

// let filteredCount = Object.keys(counts)
//   .filter((id) => counts[id] > 1)
//   .sort((a, b) => {
//     counts[a] > counts[b];
//   });
// .map((id) => {
//   return {
//     steamId: "https://steamcommunity.com/profiles/" + id,
//     count: counts[id],
//   };
// });

// console.log(filteredCount);
// console.log(await getUserSummaries(filteredCount));
