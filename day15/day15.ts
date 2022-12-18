import { readFile } from "../utils/utils.ts";

interface XY {
  x: number;
  y: number;
}

class SensorAndBeacon {
  constructor(public sensor: XY, public beacon: XY) {}

  static parseXY(strData: string) {
    const [xStr, yStr] = strData.split(", ");
    return { x: Number(xStr.split("=")[1]), y: Number(yStr.split("=")[1])};
  }

  distanceToPoint(p: XY) {
    return Math.abs(this.sensor.x - p.x) + Math.abs(this.sensor.y - p.y);
  }

  distanceToBeacon() {
    return this.distanceToPoint(this.beacon);
  }

  valuesWithinDistance(row: number) {
    const values = new Array<number>();
    const distance = this.distanceToBeacon();
    //if sensor not within distance of the row, return empty set
    if (Math.abs(this.sensor.y - row) > distance) return values;

    for (let x = this.sensor.x - distance; x < this.sensor.x + distance; x++) {
      if (this.distanceToPoint({x, y: row}) <= distance)
        values.push(x);
    }
    return values;
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

const sampleData = loadData("sample.txt");
part1(sampleData);
part2(sampleData);

const inputData = loadData("input.txt");
part1(inputData, 2000000);
part2(inputData, { x: 4000000, y: 4000000});