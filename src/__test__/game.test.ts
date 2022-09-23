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
} from "../game";

test("Fieldが生成される", () => {
  const field: FieldData = createField([]);
  expect(field.cells.length).toBe(25);
});

test("周囲が壁のField生成される", () => {
  const field: FieldData = createField([]);
  expect(field.cells[0].wall).toBe(WALL.TOP | WALL.LEFT);
  expect(field.cells[YOKO - 1].wall).toBe(WALL.TOP | WALL.RIGHT);
  expect(field.cells[(TATE - 1) * YOKO].wall).toBe(WALL.LEFT | WALL.BOTTOM);
  expect(field.cells[TATE * YOKO - 1].wall).toBe(WALL.RIGHT | WALL.BOTTOM);
});

test("BLOCKの壁を持つField生成される", () => {
  const field: FieldData = createField([[0, 1, 2, 3, 5]]);
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
