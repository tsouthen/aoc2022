import { readFile } from "../utils/utils.ts";

interface XY {
  x: number;
  y: number;
}

class Range {
  constructor(public min = 0, public max=0) {}

  contains(r: Range) {
    return this.min <= r.min && this.max >= r.max;
  }

  overlaps(r: Range) {
    return this.contains(r) || (this.min >= r.min && this.min <= r.max) || (this.max >= r.min && this.max <= r.max);
  }

  union(r: Range) {
    if (!this.overlaps(r)) return false;
    this.min = Math.min(this.min, r.min);
    this.max = Math.max(this.max, r.max);
    return true;
  }

  get length() {
    return this.max - this.min + 1;
  }
}

class Sensor {
  distance: number;
  constructor(public sensor: XY, public beacon: XY) {
    this.distance = this.distanceToPoint(beacon)
  }

  static parseXY(strData: string) {
    const [xStr, yStr] = strData.split(", ");
    return { x: Number(xStr.split("=")[1]), y: Number(yStr.split("=")[1])};
  }

  distanceToPoint(p: XY) {
    return Math.abs(this.sensor.x - p.x) + Math.abs(this.sensor.y - p.y);
  }

  valuesWithinDistance(row: number) {
    const values = new Array<number>();
    //if sensor not within distance of the row, return empty set
    if (Math.abs(this.sensor.y - row) > this.distance) return values;

    for (let x = this.sensor.x - this.distance; x < this.sensor.x + this.distance; x++) {
      if (this.distanceToPoint({x, y: row}) <= this.distance)
        values.push(x);
    }
    return values;
  }

  coversPoint(p: XY, distance: number) {
    const d = this.distanceToPoint(p);
    return d <= distance;
  }

  removeCoveredXValues(y: number, xValues: Array<number>) {
    const newXValues = new Array<number>();
    xValues.forEach((x) => {
      if (!this.coversPoint({x, y}, this.distance))
        newXValues.push(x);
    });
    return newXValues;
  }

  getCovered(row: number, min: number, max: number) : Range | undefined {
    //if sensor not within distance of the row, return empty set
    const diff = Math.abs(this.sensor.y - row);
    if (diff > this.distance) return undefined;
    const offset = this.distance - diff;
    return new Range(Math.max(min, this.sensor.x - offset), Math.min(max, this.sensor.x + offset));
  }

  static load(line: string): Sensor | undefined {
    if (!line.startsWith("Sensor at ")) return undefined;
    const [sensorStr, beaconStr] = line.split(": closest beacon is at ");
    return new Sensor(this.parseXY(sensorStr.substring(10)), this.parseXY(beaconStr));
  }
}

function loadData(fileName: string) {
  const data = new Array<Sensor>();
  readFile(fileName, import.meta.url).forEach((l) => {
    const item = Sensor.load(l);
    if (item !== undefined)
      data.push(item);
  });
  return data;
}

function part1(data: Array<Sensor>, row = 10) {
  const values = new Set<number>();
  // add all locations within distance of the row
  data.forEach(val => val.valuesWithinDistance(row).forEach((n) => values.add(n)));
  // remove the beacons on the row
  data.filter((val) => val.beacon.y === row).forEach((val) => values.delete(val.beacon.x));
  console.log(`Part 1: ${values.size}`);
}

function part2(data: Array<Sensor>, max = {x: 20, y: 20}) {
  // data.sort((a, b) => b.distance - a.distance);
  let found: XY | undefined = undefined;
  for (let row = 0; row <= max.y; row++) {
    const ranges = new Array<Range>();
    data.forEach((val) => {
      const range = val.getCovered(row, 0, max.x);
      if (range)
        ranges.push(range);
    });
    ranges.sort((a, b) => {
      const diff = a.min - b.min;
      if (diff !== 0) return diff;
      return a.max - b.max;
    });
    const newRanges = new Array<Range>();
    for (const r of ranges) {
      if (newRanges.length === 0) {
        newRanges.push(r);
      } else if (!newRanges[newRanges.length-1].union(r)) {
        newRanges.push(r);
        if (newRanges.length > 2)
          break;
      }
    }
    if (newRanges.length > 2)
      continue; // move on to next row, too many non-covered

    if (newRanges.length === 1) {
      if (newRanges[0].length === max.x) {
        found = { x: newRanges[0].min === 0 ? max.x - 1 : 0, y: row };
        break;
      }
    } else if ((newRanges[0].length + newRanges[1].length) === max.x) { //length = 2
      found = { x: newRanges[0].max + 1, y: row };
      break;
    }
  }
  if (found !== undefined) {
    console.log(`Part 2: ${found.x * 4000000 + found.y}`);
  }
}

const sampleData = loadData("sample.txt");
part1(sampleData);
part2(sampleData);

const inputData = loadData("input.txt");
part1(inputData, 2000000);
part2(inputData, { x: 4000000, y: 4000000});
