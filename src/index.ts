import Koa from "koa";
import { getFriends, resolveVanity, getUserSummaries } from "./steam.js";

const app = new Koa();

app.use(async (ctx) => {
  let counts = {};
  let blah = await resolveVanity("Sparkles2dig");
  let blah2 = await resolveVanity("SparklesYT");
  let targetList: Array<string> = [blah, blah2];

  for (let targetId of targetList) {
    let friends = await getFriends(targetId);

    friends.forEach((id: number) => {
      counts[id] ? counts[id]++ : (counts[id] = 1);
    });
  }

  let filteredCount = Object.keys(counts)
    .filter((id) => counts[id] > 1)
    .sort((a, b) => {
      return counts[a] > counts[b] ? 1 : 0;
    })
    .map((id) => {
      return {
        steamId: "https://steamcommunity.com/profiles/" + id,
        count: counts[id],
      };
    });
  console.log(filteredCount);
  ctx.body = "Hello World!";
});

app.listen(3000);

// console.log(await getUserSummaries(filteredCount));
