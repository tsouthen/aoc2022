import { Point, readFile } from "../utils/utils.ts";

class Rope extends Array<Point> {
  tailPositions = new Array<Point>();

  static create(knots = 2) {
    const rope = new Rope(knots);
    for (let ii=0; ii < knots; ii++)
      rope[ii] = new Point();
    rope.pushTailPosition();
    return rope;
  }

  static adjustPoint(pt: Point, direction: string, count = 1) {
    if (direction === "D")
      pt.y -= count;
    else if (direction === "U")
      pt.y += count;
    else if (direction === "L")
      pt.x -= count;
    else if (direction === "R")
      pt.x += count;
  }

  private pushTailPosition() {
    if (this.length > 0) {
      const tailPos = this[this.length-1].copy();
      this.tailPositions.push(tailPos);
      console.log(`Pushed tail position: ${tailPos.x}, ${tailPos.y}`);
    }
  }

  adjustKnot(curr: Point, prev: Point, direction: string) {
    const distance = prev.distanceTo(curr);
    if (distance > Math.SQRT2) { 
      Rope.adjustPoint(curr, direction);
      if (distance !== 2) { //at an angle, move diagonally 
        if (direction === "U" || direction === "D")
          curr.x = prev.x;
        else
          curr.y = prev.y;
      }
    }
  }

  move(direction: string, count: number) {
    const head = this[0];
    for (let ii=0; ii < count; ii++) {
      Rope.adjustPoint(head, direction);
      for (let knot = 1; knot < this.length; knot++) {
        this.adjustKnot(this[knot], this[knot-1], direction);
      }
      this.pushTailPosition();
    }  
  }

  countTailPositions() {
    this.tailPositions.sort(Point.compare);
    const unique = this.tailPositions.reduce((acc, curr, idx, pts) => {
      if (idx > 0 && pts[idx-1].equals(curr)) return acc;
        return acc + 1;
    }, 0);
    return unique;
  }
}

const lines = readFile("sample1.txt", import.meta.url);
// const rope1 = Rope.create(2);
const rope2 = Rope.create(10);
lines.forEach((line) => {
  if (line.length === 0) return;
  const [direction, count] = line.split(" ");
  // rope1.move(direction, Number(count));
  rope2.move(direction, Number(count));
});
// const unique1 = rope1.countTailPositions();
// console.log(`Part 1: ${unique1}`);
const unique2 = rope2.countTailPositions();
console.log(`Part 2: ${unique2}`);
