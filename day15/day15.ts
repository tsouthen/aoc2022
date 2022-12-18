import { readFile } from "../utils/utils.ts";

interface XY {
  x: number;
  y: number;
}

class SensorAndBeacon {
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

  static load(line: string): SensorAndBeacon | undefined {
    if (!line.startsWith("Sensor at ")) return undefined;
    const [sensorStr, beaconStr] = line.split(": closest beacon is at ");
    const sAndB = new SensorAndBeacon(this.parseXY(sensorStr.substring(10)), this.parseXY(beaconStr));
    return sAndB;
  }
}

function loadData(fileName: string) {
  const data = new Array<SensorAndBeacon>();
  readFile(fileName, import.meta.url).forEach((l) => {
    const item = SensorAndBeacon.load(l);
    if (item !== undefined)
      data.push(item);
  });
  return data;
}

function part1(data: Array<SensorAndBeacon>, row = 10) {
  const values = new Set<number>();
  // add all locations within distance of the row
  data.forEach(val => val.valuesWithinDistance(row).forEach((n) => values.add(n)));
  // remove the beacons on the row
  data.filter((val) => val.beacon.y === row).forEach((val) => values.delete(val.beacon.x));
  console.log(`Part 1: ${values.size}`);
}

function getArrayOfValues(max: number) {
  const arr = new Array<number>(max+1);
  for (let x = 0; x <= max; x++) {
    arr[x] = x;
  }
  return arr;
}

function part2(data: Array<SensorAndBeacon>, max = {x: 20, y: 20}) {
  for (let row = 0; row <= max.y; row++) {
    const values = new Set<number>();
    // add all locations within distance of the row and within the bounds of 0 to max.x
    data.forEach(val => val.valuesWithinDistance(row).forEach((x) => {if (x >= 0 && x <= max.x) values.add(x)}));
    // see if the row has any empty values
    if (values.size !== max.x + 1) {
      for (let x=0; x <= max.x; x++) {
        if (!values.has(x)) {
          console.log(`Part 2: ${x * 4000000 + row}`);
          return;
        }
      }
    }
  }
}

function part2New(data: Array<SensorAndBeacon>, max = {x: 20, y: 20}) {
  data.sort((a, b) => b.distance - a.distance);
  const fullArray = getArrayOfValues(max.x);
  for (let row = 0; row <= max.y; row++) {
    let xValues = fullArray.slice();
    data.forEach((val) => {
      if (xValues.length !== 0) {
        const newVals = val.removeCoveredXValues(row, xValues);
        xValues = newVals;
      }
    });
    if (xValues.length === 1) {
      console.log(`Part 2: ${xValues[0] * 4000000 + row}`);
      return;
    }
  }
}

const sampleData = loadData("sample.txt");
part1(sampleData);
// part2(sampleData);
part2New(sampleData);

const inputData = loadData("input.txt");
part1(inputData, 2000000);
part2New(inputData, { x: 4000000, y: 4000000});