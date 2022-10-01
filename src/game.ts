import { latinSquare, patternData } from "./data";
const TATE: number = 5;
const YOKO: number = 5;

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
  blocks: number[][];
  cells: CellData[];
  solved: boolean;
};

type CommandData = {
  func: (cell: CellData) => CellData;
};

const createField = (): FieldData => {
  const blocks: number[][] =
    patternData[Math.floor(Math.random() * patternData.length)];
  const blocks1: number[][] = _rotateBlocks(blocks);
  const blocks2: number[][] = _rotateBlocks(blocks1);
  const blocks3: number[][] = _rotateBlocks(blocks2);
  const blocksTable: number[][][] = [blocks, blocks1, blocks2, blocks3];

  const field: FieldData = _createField(
    blocksTable[Math.floor(Math.random() * 4)]
  );

  const hint: { [key: number]: number } = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5 };

  Object.keys(hint).forEach(
    (key) => (field.cells[parseInt(key)].value = hint[parseInt(key)])
  );

  return field;
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

  return { blocks: blocks, cells: newCells, solved: false };
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

const _getBlock = (cellNo: number, blocks: number[][]): number[] => {
  for (const block of blocks) {
    if (block.indexOf(cellNo) >= 0) return block;
  }
  return [];
};

const _getPeers = (cellNo: number, blocks: number[][]): number[] => {
  const cellX = cellNo % YOKO;
  const cellY = Math.floor(cellNo / YOKO);

  // 横の peers で初期化
  const yoko: number[] = new Array<number>(YOKO)
    .fill(cellY * YOKO)
    .map((e, i) => e + i);

  // 縦の peers を追加
  const tate: number[] = new Array<number>(TATE)
    .fill(cellX)
    .map((e, i) => e + i * YOKO);

  // ブロック内の peers を追加
  const block: number[] = _getBlock(cellNo, blocks);

  const result: number[] = [...tate, ...yoko, ...block].sort((a, b) => a - b);
  return result.filter((e, i) => result.indexOf(e) === i);
};

const resolver = (blocks: number[][]): number[] => {
  for (const ls of latinSquare) {
    let flg: boolean = true;
    for (const block of blocks) {
      let values: number[] = block.map((v) => ls[v]);
      if (
        values.filter((e, i, self) => self.indexOf(e) === i).length <
        values.length
      )
        flg = false;
    }
    if (flg) return ls;
  }

  return [];
};

const checkField = (field: FieldData): boolean => {
  const answer: number[] = resolver(field.blocks);
  const values: number[] = field.cells.map((cell) => cell.value || 0);
  return answer.every((e, i) => e === values[i]);
};

export {
  TATE,
  YOKO,
  WALL,
  createField,
  setValue,
  addCandidate,
  removeCandidate,
  resolver,
  checkField,
};
export type { CellData, FieldData, CommandData };
export const __local__ = {
  _createField,
  _rotateBlocks,
  _getPeers,
};
