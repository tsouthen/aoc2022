import { readFile } from "../utils/utils.ts";

interface XY {
  x: number;
  y: number;
}

enum Content {
  Sand = "o",
  Rock = "#",
  Air = "."
}

class Grid {
  map = new Map<number, Array<Content>>();

  getContent(p: XY) {
    return this.map.get(p.x)?.at(p.y) ?? Content.Air;
  }

  setContent(p: XY, value: Content) {
    const hasX = this.map.has(p.x);
    if (hasX) {
      const row = this.map.get(p.x)!;
      row.length = Math.max(row.length, p.y + 1);
      row[p.y] = value;
    } else {
      const row = new Array<Content>(p.y + 1);
      row[p.y] = value;
      this.map.set(p.x, row);
    }
  }

  addContent(from: XY, to: XY, value: Content) {
    if (from.x > to.x) [from.x, to.x] = [to.x, from.x];
    if (from.y > to.y) [from.y, to.y] = [to.y, from.y];

    for (let x = from.x; x <= to.x; x++) {
      for (let y = from.y; y <= to.y; y++) {
        this.setContent({x, y}, value);
      }
    }
  }

  get maxColumnHeight() {
    return Array.from(this.map.values()).reduce((max, col) => Math.max(max, col.length), 0);
  }

  get sortedKeys() {
    return Array.from(this.map.keys()).sort((a, b) => a - b);
  }

  toString() {
    const maxLen = this.maxColumnHeight;
    const rows = this.sortedKeys.reduce((rows, key) => {
      for (let y=0; y < maxLen; y++)
        rows[y] = (rows[y] ?? "") + (this.map.get(key)![y] ?? Content.Air);
      return rows;
    }, new Array<string>());
    return rows.join("\n");
  }

  load(lines: Array<string>) {
    lines.forEach((l) => {
      const coords = l.split(" -> ");
      if (coords.length > 1) {
        for (let idx = 1; idx < coords.length; idx++) {
          const [fx, fy] = coords[idx-1].split(",").map(Number);
          const [tx, ty] = coords[idx].split(",").map(Number);
          this.addContent({ x: fx, y: fy}, {x: tx, y: ty}, Content.Rock);
        }
      }
    });
  }

  // Drops p by one (according to the rules) and returns the new value or undefined if it falls forever.
  // Returns the original point if it can't drop further.
  dropSand(p: XY, maxHeight: number | undefined) {
    const col = this.map.get(p.x);
    if (maxHeight === undefined && (col === undefined || p.y >= col.length))
      return undefined;

    if ((p.y + 1) === maxHeight)
      return p;

    for (const xOffset of [0, -1, 1]) {
      const candidate = this.getContent({x: p.x + xOffset, y: p.y + 1});
      if (candidate === Content.Air)
        return {x: p.x + xOffset, y: p.y+1};
    }
    return p;
  }

  addSand(maxHeight: number | undefined = undefined) {
    const p = { x: 500, y: 0};
    const currVal = this.getContent(p);
    if (currVal !== Content.Air)
      return undefined;
    let currPt = {...p};
    while (true) {
      const newPos = this.dropSand(currPt, maxHeight);
      if (newPos === currPt) {
        this.setContent(newPos, Content.Sand);
        return newPos;
      }
      if (newPos === undefined) {
        return undefined;
      }
      currPt = newPos;
    }
  }

  clearSand() {
    this.map.forEach((vals) => vals.forEach((val, index, col) => {if (val === Content.Sand) col[index] = Content.Air}));
  }

  addSandUntilDone(maxHeight: number | undefined = undefined) {
    this.clearSand();
    let count = 0;
    while (true) {
      const newPos = this.addSand(maxHeight);
      if (newPos === undefined)
        break;
      count++;
    }
    return count;
  }
}

const grid = new Grid();
grid.load(readFile("input.txt", import.meta.url));
const count1 = grid.addSandUntilDone();
console.log(`Part 1: ${count1}`);
const count2 = grid.addSandUntilDone(grid.maxColumnHeight + 1);
console.log(`Part 2: ${count2}`);
