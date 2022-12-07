import { readFile } from "../utils/utils.ts";

class Strategy {
  constructor(public opponent = "", public instruction = "") {}

  private static instructionToShape = new Map([["X", "A"], ["Y", "B"], ["Z", "C"]]);
  private static shapeToScore = new Map([["A", 1], ["B", 2], ["C", 3]]);
  private static loseMap = new Map([["A", "C"], ["B", "A"], ["C", "B"]]);
  private static winMap = new Map([["A", "B"], ["B", "C"], ["C", "A"]]);

  outCome(shape: string): number {
    if (this.opponent === shape) return 3;
    if (Strategy.winMap.get(this.opponent) === shape) return 6;
    return 0;
  }

  score1() {
    const shape = Strategy.instructionToShape.get(this.instruction) ?? "";
    return this.outCome(shape) + (Strategy.shapeToScore.get(shape) ?? 0);
  }

  score2() {
    let shape = "";
    if (this.instruction === "X") { //lose
      shape = Strategy.loseMap.get(this.opponent) ?? "";
    } else if (this.instruction === "Y") { //draw
      shape = this.opponent;
    } else { //win
      shape = Strategy.winMap.get(this.opponent) ?? "";
    }
    return this.outCome(shape) + (Strategy.shapeToScore.get(shape) ?? 0);
  }
}

const strategies = readFile("input.txt", import.meta.url)
  .filter((value) => value.length === 3)
  .map((value) => new Strategy(value[0], value[2]));

const score1 = strategies.reduce((acc, current) => {
  return acc + current.score1();
}, 0);
console.log(`Part 1: ${score1}`);

const score2 = strategies.reduce((acc, current) => {
  return acc + current.score2();
}, 0);
console.log(`Part 2: ${score2}`);