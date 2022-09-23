import {
  CellData,
  FieldData,
  createField,
  WALL,
  TATE,
  YOKO,
  commandValue,
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

test("commandValueはvalueを指定の値に設定する", () => {
  const cell: CellData = { wall: WALL.NONE };
  expect(cell.value).not.toBe(1);
  const newCell: CellData = commandValue(cell, 1);
  expect(newCell.value).toBe(1);
});
