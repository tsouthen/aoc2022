import { readFile } from "../utils/utils.ts";

class File {
  constructor(public name: string, public size: number) {}
}

class Directory {
  constructor (public name: string, public parent: Directory | undefined = undefined) {}
  size = 0;
  files = new Array<File>();
  subDirs = new Array<Directory>();

  calculateSize() {
    this.size = 0;
    this.files.forEach(f => this.size += f.size);
    this.subDirs.forEach((d) => {
      this.size += d.calculateSize();
    });
    return this.size;
  }

  print(depth = 0) {
    console.log('  '.repeat(depth) + `- ${this.name} (dir, size=${this.size})`);
    this.files.forEach(f => console.log('  '.repeat(depth+1) + `- ${f.name} (file, size=${f.size})`));
    this.subDirs.forEach(d => d.print(depth + 1));
  }

  traverse(callback: (dir: Directory) => void) {
    callback(this);
    this.subDirs.forEach(s => s.traverse(callback));
  }
}

function go() {
  const root = new Directory("/");
  let cd: Directory | undefined = undefined;
  readFile("input.txt", import.meta.url).forEach(line => {
    if (line === "$ cd /") {
      cd = root;
    } else if (line === "$ ls") {
      //do nothing, next lines are the contents
    } else if (line === "$ cd ..") {
      cd = cd?.parent;
    } else if (line.startsWith("$ cd ")) {
      const subDirName = line.substring(5);
      cd = cd?.subDirs.find((dir) => dir.name === subDirName);
    } else if (line.startsWith("dir ")) {
      cd?.subDirs.push(new Directory(line.substring(4), cd));
    } else if (line[0] > '0' && line[0] <= '9') {
      const parts = line.split(" ");
      cd?.files.push(new File(parts[1], Number(parts[0])));
    }
  });

  root.calculateSize();
  let result1 = 0;
  root.traverse((d) => {
    if (d.size <= 100000)
      result1 += d.size;
  });
  console.log(`Part 1: ${result1}`);

  const freeStillNeeded = 30000000 - (70000000 - root.size);
  const dirsToDelete = new Array<Directory>();
  root.traverse((d) => {
    if (d.size >= freeStillNeeded)
      dirsToDelete.push(d);
  });
  dirsToDelete.sort((d1, d2) => d1.size - d2.size);
  const result2 = dirsToDelete[0].size;
  console.log(`Part 2: ${result2}`);
}

go();
