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
      return 0;
    if (this.value === "E")
      return "z".charCodeAt(0) - aVal;
    return this.value.charCodeAt(0) - aVal;
  }

  canMoveTo(n: Node) {
    return n.height - this.height <= 1;
  }
}

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
    const width = map[0].length;
    const height = map.length;
    for (let x = pt.x - 1; x <= pt.x + 1; x += 2) {
      if (x >= 0 && x < width) {
        const neighbour = map[pt.y][x];
        if (n.canMoveTo(neighbour))
          neighbours.push(neighbour);
      }
    }
    for (let y = pt.y - 1; y <= pt.y + 1; y += 2) {
      if (y >= 0 && y < height) {
        const neighbour = map[y][pt.x];
        if (n.canMoveTo(neighbour))
          neighbours.push(neighbour);
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

const lines = readFile("input.txt", import.meta.url);
map.load(lines, (char => {
  const node = new Node(id++, char);
  if (char === "S") 
    options.start = node;
  else if (char === "E")
    options.end = node;
  return node;
}));

function part1() {
  const result = aStar(options);
  if (result.status === "success")
    console.log(`Part 1: ${result.path.length - 1}`);
  else
    console.log(`Part 1: failed`);  
}

function part2() {
  let minDistance = 0;
  map.traverse((n => {
    if (n.height === 0) {
      options.start = n;
      const result = aStar(options);
      if (result.status === "success") {
        const currDist = result.path.length - 1;
        minDistance = minDistance === 0 ? currDist : Math.min(minDistance, currDist);
      }
    }
  }));
  console.log(`Part 2: ${minDistance}`);
}

part1();
part2();