export function readFile(url: string | URL, base?: string | URL | undefined): Array<string> {
  const data = Deno.readFileSync(new URL(url, base));
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(data).split("\n");
}

export type StringFactory<T> = (value: string) => T;

export class Matrix<T> extends Array<Array<T>> {
  getColumn(index: number) {
    const column = new Array<T>();
    this.forEach(r => column.push(r[index]));
    return column;
  }

  get columns() {
    const columns = new Array<Array<T>>();
    const width = this[0].length;
    for (let ii=0; ii < width; ii++) {
      columns.push(this.getColumn(ii));
    }
    return columns;
  }

  get rows() {
    return this;
  }

  loadRow(line: string, factory: StringFactory<T>) {
    if (line.length === 0) return;
    this.push(line.split("").map(factory));
  }

  load(lines: Array<string>, factory: StringFactory<T>) {
    lines.forEach(line => this.loadRow(line, factory));
  }

  traverse(callback: (entry: T, rowIdx: number, colIdx: number) => void) {
    this.forEach((r, rowIdx) => r.forEach((e, colIdx) => callback.apply(this, [e, rowIdx, colIdx])));
  }

  reduceAll<V>(callback: (entry: T, acc: V) => V, initValue: V) {
    return this.reduce((acc, row) => row.reduce((acc2, entry) => callback.apply(this, [entry, acc2]), acc), initValue);
  }
}
