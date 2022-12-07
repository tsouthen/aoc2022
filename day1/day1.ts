import { readFile } from "../utils/utils.ts";

class Elf {
  constructor(public energy = 0) {}
}

const lines = readFile("input.txt", import.meta.url);
const elves = lines.reduce((prev, curr, index, array) => {
  if (curr.length > 0) {
    const energy = Number(curr);
    if (prev.length > 0) {
      prev[prev.length-1].energy += energy;
    } else {
      prev.push(new Elf(energy));
    }
  } else if (index < (array.length - 1)) {
    prev.push(new Elf());    
  }
  return prev;
}, Array<Elf>());

const sorted = elves.sort((e1, e2) => e2.energy - e1.energy);
console.log(`Part 1: ${sorted[0].energy}`);
console.log(`Part 2: ${sorted[0].energy + sorted[1].energy + sorted[2].energy}`);
