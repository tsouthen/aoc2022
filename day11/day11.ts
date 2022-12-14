import { readFile } from "../utils/utils.ts";
import { chunk } from "https://deno.land/std@0.167.0/collections/chunk.ts";

class Monkey {
  index = 0;
  items = new Array<number>;
  inspectionCount = 0;
  operationValue = 0;
  multiply = false;
  divisibleBy = 0;
  falseMonkey = 0;
  trueMonkey = 0;

  static parse(lines: Array<string>) {
    const monkey = new Monkey();
    lines.forEach((line) => {
      line = line.trim();
      if (line.startsWith("Monkey ")) {
        line = line.slice(7, -1);
        monkey.index = Number(line);
      } else if (line.startsWith("Starting items: ")) {
        const items = line.substring(16).split(", ").map(Number);
        monkey.items.push(...items);
      } else if (line.startsWith("Operation: new = old ")) {
        const ops = line.substring(21).split(" ");
        if (ops.length === 2) {
          monkey.multiply = ops[0] === "*";
          if (ops[1] !== "old")
            monkey.operationValue = Number(ops[1]);
        }
      } else if (line.startsWith("Test: divisible by ")) {
        monkey.divisibleBy = Number(line.substring(19));
      } else if (line.startsWith("If true: throw to monkey ")) {
        monkey.trueMonkey = Number(line.substring(25));
      } else if (line.startsWith("If false: throw to monkey ")) {
        monkey.falseMonkey = Number(line.substring(26));        
      }
    });
    return monkey;
  }

  round(monkies: Array<Monkey>, part1 = true, maxDivisor: number) {
    while (this.items.length > 0) {
      let item = this.items.shift();
      if (item === undefined) break;
      this.inspectionCount++;
      
      if (this.multiply && this.operationValue === 0) {
        item = item * item;
      } else if (this.multiply) {
        item = item * this.operationValue;
      } else {
        item = item + this.operationValue;
      }

      if (part1) {
        item = Math.floor(item / 3);
      } else {
        item = item % maxDivisor;
      }
      const throwTo = (item % this.divisibleBy === 0) ? this.trueMonkey : this.falseMonkey;
      monkies[throwTo].items.push(item);
    }
  }
}

function go(lines: Array<string>, count = 20, part1 = true) {
  const monkies = chunk(lines, 7).map((lines) => Monkey.parse(lines));
  const maxDivisor = monkies.reduce((acc, curr) => acc * curr.divisibleBy, 1);
  while (count > 0) {
    count--;
    for (const monkey of monkies) {
      monkey.round(monkies, part1, maxDivisor);
    }
  }
  monkies.sort((a, b) => b.inspectionCount - a.inspectionCount);
  return monkies[0].inspectionCount * monkies[1].inspectionCount;
}

const lines = readFile("input.txt", import.meta.url);
console.log(`Part 1: ${go(lines)}`);
console.log(`Part 2: ${go(lines, 10000, false)}`);
