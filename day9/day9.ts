import { readFile } from "../utils/utils.ts";

class Point {
  constructor(public x = 0, public y = 0) {}

  adjust(direction: string, count = 1) {
    if (direction === "D")
      this.y -= count;
    else if (direction === "U")
      this.y += count;
    else if (direction === "L")
      this.x -= count;
    else if (direction === "R")
      this.x += count;
  }

  static distanceBetween(p1: Point, p2: Point) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  distanceTo(p: Point) {
    return Point.distanceBetween(p, this);
  }

  isTouching(p: Point) {
    return Math.abs(p.x - this.x) <= 1 && Math.abs(p.y - this.y) <= 1;
  }

  equals(p: Point) {
    return Point.areEqual(p, this);
  }

  static areEqual(p1: Point, p2: Point) {
    return Point.compare(p1, p2) === 0;
  }

  static compare(p1: Point, p2: Point) {
    const diffX = p1.x - p2.x;
    return (diffX === 0) ? p1.y - p2.y : diffX;
  }

  copy() {
    return new Point(this.x, this.y);
  }
}

class Rope extends Array<Point> {
  tailPositions = new Array<Point>();

  static create(knots = 2) {
    const rope = new Rope(knots);
    for (let ii=0; ii < knots; ii++)
      rope[ii] = new Point();
    rope.pushTailPosition();
    return rope;
  }

  private pushTailPosition() {
    if (this.length > 0)
      this.tailPositions.push(this[this.length-1].copy());
  }

  adjustKnot(curr: Point, prev: Point, direction: string) {
    const distance = prev.distanceTo(curr);
    if (distance > Math.SQRT2) { 
      curr.adjust(direction);
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
      head.adjust(direction);
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
// const tailPositions = new Array<Point>();
// const head = new Point();
// const tail = new Point();
// tailPositions.push(tail.copy());
// lines.forEach((line) => {
//   if (line.length === 0) return;
//   const [direction, count] = line.split(" ");
//   for (let ii=0; ii < Number(count); ii++) {
//     head.adjust(direction);
//     const distance = head.distanceTo(tail);
//     if (distance > Math.SQRT2) { 
//       tail.adjust(direction);
//       if (distance !== 2) { //at an angle, move diagonally 
//         if (direction === "U" || direction === "D")
//           tail.x = head.x;
//         else
//           tail.y = head.y;
//       }
//     }
//     tailPositions.push(tail.copy());
//   }
// });
// tailPositions.sort(Point.compare);
// const unique = tailPositions.reduce((acc, curr, idx, pts) => {
//   if (idx > 0 && pts[idx-1].equals(curr)) return acc;
//   return acc + 1;
// }, 0);
// console.log(`Part 1: ${unique}`);

const rope1 = Rope.create(2);
const rope2 = Rope.create(10);
lines.forEach((line) => {
  if (line.length === 0) return;
  const [direction, count] = line.split(" ");
  rope1.move(direction, Number(count));
  rope2.move(direction, Number(count));
});
const unique1 = rope1.countTailPositions();
console.log(`Part 1: ${unique1}`);
const unique2 = rope2.countTailPositions();
console.log(`Part 2: ${unique2}`);
