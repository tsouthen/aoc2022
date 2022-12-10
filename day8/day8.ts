import { Matrix, readFile } from "../utils/utils.ts";

class Tree {
  constructor(public height: number, public visible = false, public scenicScore = 0) {}
}

class TreeGrid extends Matrix<Tree> {
  maxScenicScore = 0;

  static create(lines: Array<string>) {
    const grid = new TreeGrid();
    grid.load(lines, (ch) => new Tree(Number(ch)));
    return grid;
  }

  static setArrayVisibility(array: Array<Tree>) {
    let minHeight = array[0].height;
    for (let ii=1; ii<array.length - 1; ii++) {
      const currTree = array[ii];
      if (currTree.height > minHeight) {
        currTree.visible = true;
        minHeight = currTree.height;
        if (minHeight === 9) break; //can't go any higher
      }
    }
  }

  setVisibility() {
    const rows = this.rows;
    rows[0].forEach(t => t.visible = true);
    rows[rows.length-1].forEach(t => t.visible = true);

    rows.slice(1, -1).forEach((row) => {
      TreeGrid.setArrayVisibility(row);
      TreeGrid.setArrayVisibility(row.toReversed());      
    });

    const columns = this.columns;
    columns[0].forEach(t => t.visible = true);
    columns[columns.length-1].forEach(t => t.visible = true);

    columns.slice(1, -1).forEach((col) => {
      TreeGrid.setArrayVisibility(col);
      TreeGrid.setArrayVisibility(col.toReversed());      
    });
  }

  static countVisible(tree: Tree, data: Array<Tree>) {
    let count = 0;
    for (const currTree of data) {
      count++;
      if (currTree.height >= tree.height) 
        break;
    }
    return count;
  }

  setScenicScore(tree: Tree, rowIdx: number, colIdx: number) {
    const row = this.rows[rowIdx];
    const col = this.columns[colIdx];

    if (rowIdx === 0 || rowIdx === (row.length-1) || colIdx === 0 || colIdx === (col.length-1)) {
      tree.scenicScore = 0;
    } else {
      tree.scenicScore = 
        TreeGrid.countVisible(tree, row.slice(0, colIdx).reverse()) *
        TreeGrid.countVisible(tree, row.slice(colIdx + 1)) *
        TreeGrid.countVisible(tree, col.slice(0, rowIdx).reverse()) *
        TreeGrid.countVisible(tree, col.slice(rowIdx + 1));

      this.maxScenicScore = Math.max(this.maxScenicScore, tree.scenicScore);
    }
  }

  setScenicScores() {
    this.maxScenicScore = 0;
    this.traverse(this.setScenicScore);
    return this.maxScenicScore;
  }
}

const lines = readFile("input.txt", import.meta.url);
const grid = TreeGrid.create(lines);
grid.setVisibility();
const result1 = grid.reduceAll((tree, acc) => {
  return acc + (tree.visible ? 1 : 0);
}, 0);
console.log(`Part 1: ${result1}`);

const result2 = grid.setScenicScores();
console.log(`Part 2: ${result2}`);
