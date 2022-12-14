import { readFile } from "../utils/utils.ts";

const lines = readFile("input.txt", import.meta.url);

const values = new Array<number>();
values.push(0);
lines.forEach((line) => {
  if (line.length === 0) return;
  if (line === "noop") {
    values.push(0);
  } else if (line.startsWith("addx ")) {
    values.push(0);
    values.push(Number(line.substring(5)));
  }
});
let prevNum = 0;
let prevSum = 1;
let signalStrength = 0;
for (let num=20; num < values.length; num += 40) {
  const sum = values.slice(prevNum, num).reduce((acc, curr) => {
    return acc + curr;
  }, prevSum);
  signalStrength += (num * sum);
  prevNum = num;
  prevSum = sum;
}
console.log(`Part 1: ${signalStrength}`);

console.log("Part 2:");
values.shift();
let pos = 1;
for (let num=0; num < values.length; num += 40) {
  let line = "";
  const lineVals = values.slice(num, num+40);
  lineVals.forEach((val, index) => {
    if (Math.abs(pos - index) <= 1) {
      line += "#";
    } else {
      line += ".";
    }
    pos += val;
  });
console.log(line);
}