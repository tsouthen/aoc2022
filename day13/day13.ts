import { readFile } from "../utils/utils.ts";
import { chunk } from "https://deno.land/std@0.167.0/collections/chunk.ts";

type Packet = number | Array<Packet>;

enum Order {
  Correct, Incorrect, Continue
}

function correctlyOrdered(left: Packet, right: Packet): Order {
  const lType = typeof left;
  const rType = typeof right;

  if (lType === "number" && rType === "number") { //both are numbers
    return left < right ? Order.Correct : (left === right ? Order.Continue : Order.Incorrect);
  }
  if (lType === "number") { //right is array
    return correctlyOrdered([left], right);
  }
  if (rType === "number") { //left is array
    return correctlyOrdered(left, [right]);
  }
  //ensure they're arrays
  if (!Array.isArray(left) || !Array.isArray(right)) {
    debugger;
    return Order.Incorrect; //throw instead?
  }

  //both sides are arrays
  if (left.length === 0) {
    return Order.Correct;
  }
  if (right.length === 0) {
    return Order.Incorrect;
  }
  // both have data
  for (let ii = 0; ii < left.length; ii++) {
    if (ii === right.length)
      return Order.Incorrect;
    const order = correctlyOrdered(left[ii], right[ii]);
    if (order != Order.Continue)
      return order;
  }
  return left.length < right.length ? Order.Correct : Order.Continue;
}

const lines = readFile("input.txt", import.meta.url);

function part1() {
  let idx = 1;
  let result = 0;
  chunk(lines, 3).forEach(([left, right]) => {
    const [leftData, rightData] = [JSON.parse(left), JSON.parse(right)];
    const order = correctlyOrdered(leftData, rightData);
    if (order === Order.Continue) {
      debugger;
    } else if (order === Order.Correct) {
      result += idx;
      console.log(`${idx}`);
    }
    idx++;
  });
  // console.log(`Part 1: ${result}`);
}

part1();