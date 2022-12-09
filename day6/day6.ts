import { readFile } from "../utils/utils.ts";

function allUnique(data: string) {
  const set = new Set<string>();
  data.split("").forEach(ch => set.add(ch));
  return set.size === data.length;
}

function findStartOfPacket(data: string, packetSize = 4) {
  let idx = 0;
  while (idx + packetSize < data.length) {
    let curr = data.substring(idx, idx + packetSize);
    if (allUnique(curr)) {
      return idx + packetSize;
    }
    idx++;
  }
  return 0;
}

const data = readFile("input.txt", import.meta.url);
const result1 = findStartOfPacket(data[0]);
console.log(`Part 1: ${result1}`);

const result2 = findStartOfPacket(data[0], 14);
console.log(`Part 2: ${result2}`);
