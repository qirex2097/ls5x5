const TATE: number = 5;
const YOKO: number = 5;

const pattern_data: number[][][] = [
  [
    [0, 1, 2, 5, 10],
    [4, 9, 14, 13, 18],
    [24, 23, 22, 21, 19],
    [20, 15, 16, 11, 6],
    [3, 7, 8, 12, 17],
  ],
  [
    [0, 1, 2, 5, 10],
    [4, 3, 8, 7, 6],
    [24, 23, 22, 21, 17],
    [20, 15, 16, 11, 12],
    [9, 13, 14, 18, 19],
  ],
  [
    [0, 1, 2, 5, 10],
    [4, 3, 8, 7, 6],
    [24, 23, 19, 14, 9],
    [20, 21, 22, 17, 18],
    [11, 12, 13, 15, 16],
  ],
  [
    [0, 1, 2, 5, 10],
    [4, 3, 8, 7, 12],
    [24, 19, 14, 13, 9],
    [20, 15, 16, 11, 6],
    [17, 18, 21, 22, 23],
  ],
  [
    [0, 1, 2, 3, 5],
    [4, 9, 14, 13, 18],
    [24, 23, 22, 21, 19],
    [20, 15, 10, 11, 6],
    [7, 8, 12, 16, 17],
  ],
  [
    [0, 1, 2, 3, 5],
    [4, 9, 14, 13, 18],
    [24, 23, 22, 21, 19],
    [20, 15, 16, 17, 12],
    [6, 7, 8, 10, 11],
  ],
  [
    [0, 1, 2, 5, 6],
    [4, 9, 14, 3, 13],
    [24, 23, 22, 19, 18],
    [20, 15, 10, 21, 11],
    [7, 8, 12, 16, 17],
  ],
  [
    [0, 1, 2, 5, 6],
    [4, 3, 8, 7, 12],
    [24, 23, 22, 17, 16],
    [20, 15, 10, 21, 11],
    [9, 13, 14, 18, 19],
  ],
  [
    [0, 1, 6, 7, 12],
    [4, 9, 3, 8, 2],
    [24, 23, 19, 14, 13],
    [20, 21, 22, 17, 18],
    [5, 10, 11, 15, 16],
  ],
  [
    [0, 1, 5, 10, 15],
    [4, 3, 2, 7, 6],
    [24, 23, 19, 14, 9],
    [20, 21, 22, 17, 18],
    [8, 11, 12, 13, 16],
  ],
  [
    [0, 1, 5, 10, 15],
    [4, 3, 2, 7, 6],
    [24, 23, 19, 14, 9],
    [20, 21, 16, 11, 12],
    [8, 13, 17, 18, 22],
  ],
  [
    [0, 1, 5, 6, 10],
    [4, 9, 3, 2, 7],
    [24, 23, 19, 18, 14],
    [20, 15, 21, 22, 17],
    [8, 11, 12, 13, 16],
  ],
];

enum WALL {
  NONE = 0b0000,
  TOP = 0b0001,
  LEFT = 0b0010,
  RIGHT = 0b0100,
  BOTTOM = 0b1000,
}

type CellData = {
  wall: WALL;
  value?: number;
  candidate?: number[];
  color?: string;
};

type FieldData = {
  cells: CellData[];
};

type CommandData = {
  func: (cell: CellData) => CellData;
};

const createField = (): FieldData => {
  const blocks: number[][] =
    pattern_data[Math.floor(Math.random() * pattern_data.length)];
  const blocks1: number[][] = _rotateBlocks(blocks);
  const blocks2: number[][] = _rotateBlocks(blocks1);
  const blocks3: number[][] = _rotateBlocks(blocks2);
  const blocksTable: number[][][] = [blocks, blocks1, blocks2, blocks3];

  return _createField(blocksTable[Math.floor(Math.random() * 4)]);
};
const _createField = (blocks: number[][]): FieldData => {
  const newCells: CellData[] = new Array(TATE * YOKO).fill({ wall: WALL.NONE });

  for (const block of blocks) {
    for (const cell of block) {
      let wall: WALL = WALL.NONE;
      if (block.indexOf(cell - YOKO) < 0) {
        wall |= WALL.TOP;
      }
      if (block.indexOf(cell - 1) < 0) {
        wall |= WALL.LEFT;
      }
      if (block.indexOf(cell + 1) < 0) {
        wall |= WALL.RIGHT;
      }
      if (block.indexOf(cell + TATE) < 0) {
        wall |= WALL.BOTTOM;
      }
      newCells[cell] = { wall: wall };
    }
  }

  for (let i = 0; i < YOKO; i++) {
    newCells[i] = { ...newCells[i], wall: newCells[i].wall | WALL.TOP };
  }
  for (let i = 0; i < TATE * YOKO; i += 5) {
    newCells[i] = { ...newCells[i], wall: newCells[i].wall | WALL.LEFT };
  }
  for (let i = YOKO - 1; i < TATE * YOKO; i += 5) {
    newCells[i] = { ...newCells[i], wall: newCells[i].wall | WALL.RIGHT };
  }
  for (let i = (TATE - 1) * YOKO; i < TATE * YOKO; i++) {
    newCells[i] = { ...newCells[i], wall: newCells[i].wall | WALL.BOTTOM };
  }

  return { cells: newCells };
};

const setValue = (cell: CellData, value: number): CellData => {
  return { ...cell, value: value };
};
const addCandidate = (cell: CellData, value: number): CellData => {
  if (cell.candidate) {
    if (cell.candidate.indexOf(value) < 0) {
      return { ...cell, candidate: [...cell.candidate, value].sort() };
    } else {
      return cell;
    }
  } else {
    return { ...cell, candidate: [value] };
  }
};
const removeCandidate = (cell: CellData, value: number): CellData => {
  if (cell.candidate) {
    return { ...cell, candidate: cell.candidate.filter((v) => v !== value) };
  } else {
    return cell;
  }
};
const _rotateBlocks = (blocks: number[][]): number[][] => {
  let newBlocks: number[][] = [];
  for (const block of blocks) {
    let newBlock: number[] = [];
    for (const e of block) {
      const convertTable: number[] = [
        20, 15, 10, 5, 0, 21, 16, 11, 6, 1, 22, 17, 12, 7, 2, 23, 18, 13, 8, 3,
        24, 19, 14, 9, 4,
      ];
      newBlock = [...newBlock, convertTable.indexOf(e)];
    }
    newBlocks = [...newBlocks, newBlock];
  }
  return newBlocks;
};

export {
  TATE,
  YOKO,
  WALL,
  createField,
  setValue,
  addCandidate,
  removeCandidate,
};
export type { CellData, FieldData, CommandData };
export const __local__ = {
  _createField,
  _rotateBlocks,
};
