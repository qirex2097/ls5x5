import {
  CellData,
  FieldData,
  createField,
  WALL,
  TATE,
  YOKO,
  setValue,
  addCandidate,
  removeCandidate,
  resolver,
  checkField,
  __local__,
} from "../game";

test("Fieldが生成される", () => {
  const field: FieldData = createField();
  expect(field.cells.length).toBe(25);
});

test("周囲が壁のField生成される", () => {
  const field: FieldData = __local__._createField([]);
  expect(field.cells[0].wall).toBe(WALL.TOP | WALL.LEFT);
  expect(field.cells[YOKO - 1].wall).toBe(WALL.TOP | WALL.RIGHT);
  expect(field.cells[(TATE - 1) * YOKO].wall).toBe(WALL.LEFT | WALL.BOTTOM);
  expect(field.cells[TATE * YOKO - 1].wall).toBe(WALL.RIGHT | WALL.BOTTOM);
});

test("BLOCKの壁を持つField生成される", () => {
  const field: FieldData = __local__._createField([[0, 1, 2, 3, 5]]);
  expect(field.cells[0].wall).toBe(WALL.TOP | WALL.LEFT);
  expect(field.cells[1].wall).toBe(WALL.TOP | WALL.BOTTOM);
  expect(field.cells[2].wall).toBe(WALL.TOP | WALL.BOTTOM);
  expect(field.cells[3].wall).toBe(WALL.TOP | WALL.BOTTOM | WALL.RIGHT);
  expect(field.cells[5].wall).toBe(WALL.LEFT | WALL.BOTTOM | WALL.RIGHT);
});

test("setValueはvalueを指定の値に設定する", () => {
  const cell: CellData = { wall: WALL.NONE };
  expect(cell.value).not.toBe(1);
  const newCell: CellData = setValue(cell, 1);
  expect(newCell.value).toBe(1);
});

test("setValue, addCandidate", () => {
  const cell: CellData = { wall: WALL.NONE };
  expect(cell.candidate).not.toBe(1);
  const newCell: CellData = addCandidate(cell, 1);
  expect(newCell.candidate!.length).toBe(1);
  const newCell2: CellData = addCandidate(newCell, 2);
  expect(newCell2.candidate!.length).toBe(2);
  const newCell3: CellData = removeCandidate(newCell2, 1);
  expect(newCell3.candidate!.length).toBe(1);
  //TODO
});

test("_rotateBlocksは機能する", () => {
  const blocks: number[][] = __local__._rotateBlocks([
    [0, 1, 2, 3, 4],
    [0, 1, 2, 7, 12],
  ]);
  expect(blocks[0].length).toBe(5);
  expect(blocks[0][0]).toBe(4);
  expect(blocks[0][1]).toBe(9);
  expect(blocks[0][2]).toBe(14);
  expect(blocks[0][3]).toBe(19);
  expect(blocks[0][4]).toBe(24);
  expect(blocks[1][0]).toBe(4);
  expect(blocks[1][1]).toBe(9);
  expect(blocks[1][2]).toBe(14);
  expect(blocks[1][3]).toBe(13);
  expect(blocks[1][4]).toBe(12);
});

const sample_blocks: number[][] = [
  [0, 1, 2, 5, 10],
  [4, 9, 14, 13, 18],
  [24, 23, 22, 21, 19],
  [20, 15, 16, 11, 6],
  [3, 7, 8, 12, 17],
];
const sample_answer: number[] = [
  1, 2, 3, 4, 5, 5, 1, 2, 3, 4, 4, 5, 1, 2, 3, 3, 4, 5, 1, 2, 2, 3, 4, 5, 1,
];

test("_getPeersは正しく仲間を返す", () => {
  const [cellNo, cellX, cellY] = [12, 2, 2]; //テストするセル番号、セルＸ座標、セルＹ座標
  const block = sample_blocks[4]; //テストセルを含むブロック

  const peers: number[] = __local__._getPeers(cellNo, sample_blocks);
  expect(peers.includes(cellNo)).toBe(true);
  for (let i = cellY * YOKO; i < 5; i++) {
    expect(peers.includes(i)).toBe(true);
  }
  for (let i = cellX; i < TATE * YOKO; i += YOKO) {
    expect(peers.includes(i)).toBe(true);
  }
  for (const i of block) {
    expect(peers.includes(i)).toBe(true);
  }
});
test("resolver", () => {
  const answer: number[] = resolver(sample_blocks);

  expect(answer.length).toBe(25);
  expect(answer[0]).toBe(1);
  expect(answer[1]).toBe(2);
  expect(answer[2]).toBe(3);
  expect(answer[3]).toBe(4);
  expect(answer[4]).toBe(5);
});

test("checkField", () => {
  const field: FieldData = __local__._createField(sample_blocks);
  expect(checkField(field)).toBe(false);
  field.cells.forEach((cell, i) => (cell.value = sample_answer[i]));
  expect(checkField(field)).toBe(true);
});
