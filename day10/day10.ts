import { readFile } from "../utils/utils.ts";
import { chunk } from "https://deno.land/std@0.167.0/collections/chunk.ts";

const values = readFile("input.txt", import.meta.url).reduce((values, line) => {
  if (line.length !== 0) {
    values.push(0);
    if (line.startsWith("addx "))
      values.push(Number(line.substring(5)));  
  }
  return values;
}, new Array<number>());

values.unshift(0); //to deal with "end of cycle" processing
const { signalStrength } = values.reduce(({sum, signalStrength}, value, index) => {
  return { 
    sum: sum + value, 
    signalStrength: signalStrength + ((((index - 20) % 40) === 0) ? index * sum : 0),
  };
}, { sum: 1, signalStrength: 0 });
values.shift(); //remove the extra 0 added
console.log(`Part 1: ${signalStrength}`);

console.log("Part 2:");
let position = 1;
const pixels = values.map((value, index) => {
  const result = Math.abs(position - (index % 40)) <= 1 ? "#" : " ";
  position += value;
  return result;
});
const result = chunk(pixels, 40).map(line => line.join("")).join("\n");
console.log(result);
