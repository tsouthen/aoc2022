import { readFile } from "../utils/utils.ts";

class Range {
  constructor(public min = 0, public max=0) {}

  static parse(value: string) {
    let min = 0;
    let max = 0;
    const vals = value.split("-");
    if (vals.length === 2) {
      min = Number(vals[0]);
      max = Number(vals[1]);
      if (min > max) {
        [min, max] = [max, min];
      }
    }
    return new Range(min, max);
  }

  contains(r: Range) {
    return this.min <= r.min && this.max >= r.max;
  }

  overlaps(r: Range) {
    return this.contains(r) || (this.min >= r.min && this.min <= r.max) || (this.max >= r.min && this.max <= r.max);
  }
}

const pairs = readFile("input.txt", import.meta.url).filter((val) => val.length > 0).map((value) => {
  const split = value.split(",");
  return [Range.parse(split[0]), Range.parse(split[1])];
});
const contained = pairs.filter((val) => {
  return val[0].contains(val[1]) || val[1].contains(val[0]);
});
console.log(`Part 1: ${contained.length}`);

const overlaps = pairs.filter((val) => {
  return val[0].overlaps(val[1])
});
console.log(`Part 2: ${overlaps.length}`);