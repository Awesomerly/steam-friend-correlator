import { getFriends, resolveVanity } from "./steam.js";

let counts = {};
let blah2 = await resolveVanity("HyperlimnioN");
let targetList = [blah2, "76561197973127146"];

for (let targetId of targetList) {
  let friends = await getFriends(targetId);

  friends.forEach((id) => {
    counts[id] ? counts[id]++ : (counts[id] = 1);
  });
}

let filteredCount = Object.keys(counts)
  .filter((id) => counts[id] > 1)
  .sort((a, b) => {
    counts[a] > counts[b];
  })
  .map((id) => {
    return {
      steamId: "https://steamcommunity.com/profiles/" + id,
      count: counts[id],
    };
  });

console.log(filteredCount);

// console.log(Object.entries(idSet));
// console.log(idSet.sort((a, b) => {}));
