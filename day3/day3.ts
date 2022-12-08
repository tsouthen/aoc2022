import { readFile } from "../utils/utils.ts";

class Rucksack {
  constructor(public compartment1 = "", public compartment2 = "") {}

  static intersectStrings(val1: string, val2: string) {
    let result = "";
    for (let i = 0; i < val1.length; i++) {
      const char1 = val1[i];
      if (!result.includes(char1) && val2.includes(char1)) {
        result = result + char1;
      }
    }
    return result;
  }

  get intersection() {
    return Rucksack.intersectStrings(this.compartment1, this.compartment2);
  }

  static lowerACode = "a".charCodeAt(0);
  static upperACode = "A".charCodeAt(0);

  static priority(item: string) {
    if (item.length !== 1) return 0;
    const charCode = item.charCodeAt(0);
    if (charCode >= Rucksack.upperACode && charCode <= (Rucksack.upperACode + 26)) {
      return 27 + charCode - Rucksack.upperACode;
    }
    return 1 + charCode - Rucksack.lowerACode;
  }

  get priority() {
    return Rucksack.priority(this.intersection);
  }
}

const lines = readFile("input.txt", import.meta.url);
const rucksacks = lines.map((value) => {
    return new Rucksack(value.substring(0, value.length / 2), value.substring(value.length / 2));
  });

const score1 = rucksacks.reduce((acc, curr) => {
  return acc + curr.priority;
}, 0);

console.log(`Part 1: ${score1}`);

class RucksackGroup {
  contents: Array<string> = [];

  constructor (content: string) {
    this.contents.push(content);
  }

  get intersection() {
    if (this.contents.length === 0) return "";
    let inter = this.contents[0];
    for (let i=1; i < this.contents.length; i++) {
      inter = Rucksack.intersectStrings(inter, this.contents[i]);
    }
    return inter;
  }

  get priority() {
    return Rucksack.priority(this.intersection);
  }
}

const groups = lines.reduce((acc, curr, index) => {
  const remainder = index % 3;
  if (remainder === 0) {
    acc.push(new RucksackGroup(curr));
  } else {
    acc[acc.length-1].contents.push(curr);
  }
  return acc;
}, new Array<RucksackGroup>());

const score2 = groups.reduce((acc, curr) => {
  return acc + curr.priority;
}, 0);

console.log(`Part 2: ${score2}`);
