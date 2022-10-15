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
  isHint: boolean;
};

type FieldData = {
  blocks: number[][];
  hint: { [key: number]: number };
  cells: CellData[];
  answer: number[];
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

  return field;
};
const _createField = (blocks: number[][]): FieldData => {
  const newCells: CellData[] = new Array(TATE * YOKO).fill({ wall: WALL.NONE });

  // ブロックの壁作り
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
      newCells[cell] = { wall: wall, isHint: false };
    }
  }

  // 周囲の壁作り
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

  /** 答えを作成 */
  const answers: number[][] = resolver(blocks);
  const answer: number[] = _shuffleAnswer(
    answers[Math.floor(Math.random() * answers.length)]
  ); // 答えのラテン方陣
  const hint: { [key: number]: number } = _getHintCells(answer, answers);

  Object.keys(hint).forEach(
    (key) =>
      (newCells[parseInt(key)] = {
        ...newCells[parseInt(key)],
        value: hint[parseInt(key)],
        isHint: true,
      })
  );

  return {
    blocks: blocks,
    cells: newCells,
    answer: answer,
    hint: hint,
    solved: false,
  };
};
const resetField = (field: FieldData): FieldData => {
  const newCells: CellData[] = field.cells.map((v) => {
    if (v.isHint) return { ...v, candidate: undefined, color: undefined };
    else
      return { ...v, value: undefined, candidate: undefined, color: undefined };
  });
  return { ...field, cells: newCells };
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

const resolver = (blocks: number[][]): number[][] => {
  let answers: number[][] = [];
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
    if (flg) answers = [...answers, ls];
  }

  return answers;
};

/** 1-5の数字をランダムに1-5へ変換 */
const _shuffleAnswer = (answer: number[]) => {
  const transform: number[] = [6, 7, 8, 9, 10].sort(
    (a, b) => Math.random() - 0.5
  );
  const newAnswer: number[] = answer.map((e) => {
    return transform[e - 1] - 5;
  });
  return newAnswer;
};

const _getHintCells = (
  answer: number[],
  answers: number[][]
): { [key: number]: number } => {
  let hintCells: { [key: number]: number } = {}; //戻り値用

  /**
   * 各値（１－５）が割り当てられているセル番号の配列 cells を作成
   * 1: [0, 9, 12, 16, 23]
   * 2: [1, 7, 13, 19, 20]
   * 3: [2, 8, 14, 15, 21]
   * 4: [3, 5, 11, 17, 24]
   * 5: [4, 6, 10, 18, 22]
   */
  const cells: { [key: string]: number[] } = {};
  answer.forEach((e, i) => {
    if (cells[e]) {
      cells[e] = [...cells[e], i];
    } else {
      cells[e] = [i];
    }
  });

  if (answers.length === 1) {
    /** 1-5 のいずれかをヒントから削除 */
    const deleteKey: string =
      Object.keys(cells)[Math.floor(Math.random() * Object.keys(cells).length)];
    cells[deleteKey] = [];
  } else if (answers.length === 2) {
    /**
     * 解答候補間で答えが異なるセルを抽出 -> starCells
     * 4: [5, 11]
     * 5: [6, 10]
     */
    const starCells: { [key: string]: number[] } = {};
    answers[0]
      .reduce((prev: number[], e, i) => {
        if (e !== answers[1][i]) return [...prev, i];
        else return prev;
      }, [])
      .forEach((e) => {
        const key = answer[e];
        if (starCells[key]) {
          starCells[key] = [...starCells[key], e];
        } else {
          starCells[key] = [e];
        }
      });
    const keys: string[] = Object.keys(starCells); // スターセルの値を抽出 ['4', '5']

    /**
     * starCells 以外のセル番号を抽出 -> starCellsSub
     * 4: [3, 17, 24]
     * 5: [4, 18, 22]
     */
    const starCellsSub: { [key: string]: number[] } = {};
    keys.forEach((e) => {
      starCellsSub[e] = cells[e].filter((v) => starCells[e].indexOf(v) < 0);
    });

    /** スターセルのヒントをクリア */
    keys.forEach((e) => {
      cells[e] = [];
    });

    const hcells1: number[] = keys.reduce((prev: number[], v: string) => {
      return [...prev, ...starCells[v]];
    }, []);
    const hcells2: number[] = keys.reduce((prev: number[], v: string) => {
      return [...prev, ...starCellsSub[v]];
    }, []);
    const hc1: number = hcells1[Math.floor(Math.random() * hcells1.length)];
    const hc2: number = hcells2[Math.floor(Math.random() * hcells2.length)];
    hintCells[hc1] = answer[hc1];
    hintCells[hc2] = answer[hc2];
    if (answer[hc1] !== answer[hc2]) {
      const deleteKeys = Object.keys(cells).filter((v) => keys.indexOf(v) < 0);
      const deleteKey: string =
        deleteKeys[Math.floor(Math.random() * deleteKeys.length)];
      cells[deleteKey] = [];
    }
  }

  /**
   * ヒントのセル番号とそこに入れる値 cellNo : value のヒント hintCells を作成
   */
  Object.keys(cells).forEach((key) => {
    if (cells[key].length > 0) {
      const p: number = Math.floor(Math.random() * cells[key].length);
      hintCells[cells[key][p]] = parseInt(key);
    }
  });

  return hintCells;
};

const checkField = (field: FieldData): boolean => {
  const answer: number[] = field.answer;
  const values: number[] = field.cells.map((cell) => cell.value || 0);
  return answer.every((e, i) => e === values[i]);
};

export {
  TATE,
  YOKO,
  WALL,
  createField,
  resetField,
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
  _getHintCells,
};
