import { readFile } from "../utils/utils.ts";

const lines = readFile("input.txt", import.meta.url);

const values = new Array<number>();
values.push(0); //to deal with "end of cycle" processing
lines.forEach((line) => {
  if (line.length === 0) return;
  if (line === "noop") {
    values.push(0);
  } else if (line.startsWith("addx ")) {
    values.push(0);
    values.push(Number(line.substring(5)));
  }
});

let sum = 1;
let signalStrength = 0;
for (let num = 20; num < values.length; num += 40) {
  sum = values.slice(Math.max(0, num - 40), num).reduce((acc, curr) => acc + curr, sum);
  signalStrength += (num * sum);
}
console.log(`Part 1: ${signalStrength}`);

console.log("Part 2:");
values.shift(); //remove the extra 0 added in Part 1 to deal with "end of cycle" processing
let pos = 1;
while (values.length) {
  const line = values.splice(0, 40).reduce((acc, val, index) => {
    const pixel = (Math.abs(pos - index) <= 1) ? "#" : ".";
    pos += val;
    return acc + pixel;
  }, "");
  console.log(line);
}
