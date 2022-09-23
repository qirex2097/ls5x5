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
  cells: CellData[];
};

type CommandData = {
  func: (cell: CellData) => CellData;
};

const createField = (blocks: number[][]): FieldData => {
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
    newCells[i] = { wall: newCells[i].wall | WALL.TOP };
  }
  for (let i = 0; i < TATE * YOKO; i += 5) {
    newCells[i] = { wall: newCells[i].wall | WALL.LEFT };
  }
  for (let i = YOKO - 1; i < TATE * YOKO; i += 5) {
    newCells[i] = { wall: newCells[i].wall | WALL.RIGHT };
  }
  for (let i = (TATE - 1) * YOKO; i < TATE * YOKO; i++) {
    newCells[i] = { wall: newCells[i].wall | WALL.BOTTOM };
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
