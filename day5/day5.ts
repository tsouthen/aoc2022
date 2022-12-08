import { readFile } from "../utils/utils.ts";

class Stack {
  crates: Array<string> = [];

  moveToStack(s: Stack, num: number, oneAtATime = true) {
    if (num > this.crates.length) throw "Requested more crates that contained in the stack";
    if (oneAtATime) {
      for (let ii=0; ii < num; ii++) {
        s.crates.unshift(this.crates.shift()!);
      }
    } else {
      const removals = this.crates.splice(0, num);
      s.crates.unshift(...removals);
    }
  }
}

class Stacks {
  stacks: Array<Stack> = [];

  static chunks(line: string) {
    const chunks = new Array<string>();
    let remainder = line;
    while (remainder.length) {
      let chunk = remainder.substring(0, 4);
      chunk = chunk.trim().replaceAll("[", "").replaceAll("]", "");
      chunks.push(chunk);
      remainder = remainder.substring(4);
    }
    return chunks;
  }

  loadStacks(stackLines: Array<string>) {
    this.stacks.length = 0;
    stackLines.forEach((line) => {
      const chunks = Stacks.chunks(line);
      while (this.stacks.length !== chunks.length) {
        this.stacks.push(new Stack());
      }
      for (let ii=0; ii < chunks.length; ii++) {
        if (chunks[ii].length > 0)
        this.stacks[ii].crates.push(chunks[ii]);
      }
    });
  }

  moveStacks(moveLines: Array<string>, oneAtATime = true) {
    moveLines.forEach((line) => {
      const moves = line.split(" ");
      if (moves.length === 6) {
        const num = Number(moves[1]);
        const fromIdx = Number(moves[3]) - 1;
        const toIdx = Number(moves[5]) - 1;
        this.stacks[fromIdx].moveToStack(this.stacks[toIdx], num, oneAtATime);
      }
    });    
  }

  get result() {
    return this.stacks.reduce((acc, curr) => { return acc + curr.crates[0] }, "");
  }
}

const lines = readFile("input.txt", import.meta.url);
const stackLines = lines.filter((line) => line.includes("["));
const moveLines = lines.filter((line) => line.startsWith("move"));

const stacks = new Stacks();
stacks.loadStacks(stackLines);
stacks.moveStacks(moveLines, true);
console.log(`Part 1: ${stacks.result}`);

stacks.loadStacks(stackLines);
stacks.moveStacks(moveLines, false);
console.log(`Part 2: ${stacks.result}`);
