import { Matrix, Point, readFile } from "../utils/utils.ts";
import aStar from "npm:a-star";

class Node {
  constructor(public idx: number, public value: string) {}

  getCoordinate(m: Matrix<Node>) {
    const width = m[0].length;
    return new Point(this.idx % width, Math.floor(this.idx / width));
  }

  get height() {
    const aVal = "a".charCodeAt(0);
    if (this.value === "S")
      return aVal;
    if (this.value === "E")
      return "z".charCodeAt(0) - aVal;
    return this.value.charCodeAt(0) - aVal;
  }

  canMoveTo(n: Node) {
    return n.height - this.height <= 1;
  }
}

const lines = readFile("sample.txt", import.meta.url);
const map = new Matrix<Node>();
let id = 0;

interface AStarOptions {
  start?: Node;
  end?: Node; //not used by API but convenient rather than creating a new let
  isEnd?: (n: Node) => boolean;
  neighbor?: (n: Node) => Array<Node>;
  distance?: (a: Node, b: Node) => number;
  heuristic?: (n: Node) => number;
  hash?: (n: Node) => string;
  timeout?: number;
}

const options : AStarOptions = {
  isEnd: (n: Node) => {
    return n === options.end;
  },
  neighbor: (n: Node) => {
    const neighbours = new Array<Node>();
    const pt = n.getCoordinate(map);
    // gather all neighbouring nodes that have the same height or lower
    const width = map[0].length;
    const height = map.length;
    for (let x = pt.x - 1; x <= pt.x + 1; x += 2) {
      if (x >= 0 && x < width) {
        const neighbour = map[x][pt.y];
        if (n.canMoveTo(neighbour))
          neighbours.push(n);
      }
    }
    for (let y = pt.y - 1; y <= pt.y + 1; y += 2) {
      if (y >= 0 && y < height) {
        const neighbour = map[pt.x][y];
        if (n.canMoveTo(neighbour))
          neighbours.push();
      }
    }
    return neighbours;
  },
  distance: (a: Node, b: Node) => {
    const ptA = a.getCoordinate(map);
    const ptB = b.getCoordinate(map);
    return Math.abs(ptA.x - ptB.x) + Math.abs(ptA.y - ptB.y);
  },
  heuristic: (n: Node) => {
    const ptA = n.getCoordinate(map);
    const ptB = options.end!.getCoordinate(map);
    return ptA.distanceTo(ptB);
  },
  hash: (n: Node) => {
    return n.idx.toString();
  }
};
map.load(lines, (char => {
  const node = new Node(id++, char);
  if (char === "S") 
    options.start = node;
  else if (char === "E")
    options.end = node;
  return node;
}));
console.log(`${map.length}`);
const result = aStar(options);
console.log(result);