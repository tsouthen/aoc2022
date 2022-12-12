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

  adjustKnot(curr: Point, prev: Point) {
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const xIsTwo = Math.abs(dx) === 2;
    const yIsTwo = Math.abs(dy) === 2;

    if (!xIsTwo && !yIsTwo)
      return false;

    if (xIsTwo && yIsTwo) {
      curr.x += (dx < 0) ? 1 : -1;
      curr.y += (dy < 0) ? 1 : -1;
    } else if (xIsTwo) {
      curr.x += (dx < 0) ? 1 : -1;
      if (dy !== 0) curr.y = prev.y;
    } else {
      curr.y += (dy < 0) ? 1 : -1;
      if (dx !== 0) curr.x = prev.x;
    }
    return true;
  }

  private pushTailPosition() {
    if (this.length > 0) {
      const tailPos = this[this.length-1].copy();
      this.tailPositions.push(tailPos);
    }
  }

  move(direction: string, count: number) {
    while (count > 0) {
      count--;
      for (let index=0; index < this.length; index++) {
        const knot = this[index];
        if (index === 0) {
          Rope.adjustPoint(knot, direction);
        } else {
          if (!this.adjustKnot(knot, this[index-1]))
            break;
          if (index === (this.length - 1))
            this.pushTailPosition();
        }
      }
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

  print(min: Point, max: Point) {
    for (let y = max.y; y >= min.y; y--) {
      let line = "";
      for (let x = min.x; x <= max.x; x++) {
        const idx = this.findIndex(knot => knot.equals(new Point(x, y)));
        if (idx === -1) {
          if (x === 0 && y === 0) {
            line = line + "s";
          } else {
            line = line + ".";
          }
        } else if (idx === 0) {
          line = line + "H";
        } else {
          line = line + idx.toString();
        }
      }
      console.log(line);
    }
  }
}

const lines = readFile("input.txt", import.meta.url);
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
