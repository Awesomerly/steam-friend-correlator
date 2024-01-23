import Koa from 'koa';
import * as steam from './steam-api/steam.js';
import { router } from './api.js';

const app = new Koa();
app.use(router.routes());

// app.use(async (ctx) => {
//   // let counts: { [key: string]: number } = {};
//   // let blah = await steam.resolveVanity("Sparkles2dig");
//   // let blah2 = await steam.resolveVanity("SparklesYT");
//   // let targetList: Array<string> = [blah, blah2];

//   // for (let targetId of targetList) {
//   //   let friends = await steam.getFriends(targetId);

//   //   friends.forEach((id: string) => {
//   //     counts[id] ? counts[id]++ : (counts[id] = 1);
//   //   });
//   // }

//   // let filteredCount = Object.keys(counts)
//   //   .filter((id) => counts[id] > 1)
//   //   .sort((a, b) => {
//   //     return counts[a] > counts[b] ? 1 : 0;
//   //   })
//   //   .map((id) => {
//   //     return {
//   //       steamId: "https://steamcommunity.com/profiles/" + id,
//   //       count: counts[id],
//   //     };
//   //   });
//   // console.log(filteredCount);
//   // ctx.body = "Hello World!";
// });

app.listen(3000);

// console.log(await getUserSummaries(filteredCount));
