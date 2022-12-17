import { readFile } from "../utils/utils.ts";
import { chunk } from "https://deno.land/std@0.167.0/collections/chunk.ts";

type Packet = Array<number | Packet>;

enum Order {
  Correct = -1, 
  Continue = 0,
  Incorrect = 1 
}

function compareNumbers(left: number, right: number) {
  if (left < right) return Order.Correct;
  if (left === right) return Order.Continue;
  return Order.Incorrect;
}

function isNumber(packet: number | Packet): packet is number {
  return typeof packet === "number";
}

function possiblyToArray(packetVal: number | Packet) {
  if (isNumber(packetVal))
    return [packetVal];
  return packetVal;
}

function comparePackets(left: Packet, right: Packet): Order {
  for (let ii = 0; ii < Math.min(left.length, right.length); ii++) {
    const [lVal, rVal] = [left[ii], right[ii]];
    let order = Order.Continue;
    if (isNumber(lVal) && isNumber(rVal))
      order = compareNumbers(lVal, rVal);
    else
      order = comparePackets(possiblyToArray(lVal), possiblyToArray(rVal));

    if (order !== Order.Continue)
      return order;
  }
  return compareNumbers(left.length, right.length);
}

function part1(packets: Array<Packet>) {
  let idx = 1;
  let result = 0;
  chunk(packets, 2).forEach(([left, right]) => {
    if (comparePackets(left, right) === Order.Correct)
      result += idx;
    idx++;
  });
  console.log(`Part 1: ${result}`);
}

function findDivider(packets: Array<Packet>, divider: number) {
  return packets.findIndex((p) => {
    return p.length === 1 && (typeof p[0] === "object") && p[0].length === 1 && p[0][0] === divider;
  });
}

function part2(packets: Array<Packet>) {
  const packets2 = new Array<Packet>(...packets, [[2]], [[6]]);
  packets2.sort(comparePackets);
  const twoIdx = 1 + findDivider(packets2, 2);
  const sixIdx = 1 + findDivider(packets2, 6);
  console.log(`Part 2: ${twoIdx * sixIdx}`);
}

const packets: Array<Packet> = readFile("input.txt", import.meta.url).filter((l) => l.length).map(l => JSON.parse(l));
part1(packets);
part2(packets);