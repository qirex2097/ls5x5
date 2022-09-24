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
