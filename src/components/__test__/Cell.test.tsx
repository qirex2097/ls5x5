import { render, screen } from "@testing-library/react";
import { Cell } from "../Cell";
import { CellData, WALL } from "../../game"

test("セルが描画される", () => {
  const cell: CellData = { wall: WALL.NONE }
  render(<Cell cell={cell} />);
  expect(screen.getByRole("button")).toBeInTheDocument()
});

test("壁がないセルが描画される", () => {
  const cell: CellData = { wall: WALL.NONE }
  render(<Cell cell={cell} />);
  const walls = screen.queryAllByTestId("wall")
  expect(walls.length).toBe(0)
});

test("壁が１つのセルが描画される", () => {
  const cell: CellData = { wall: WALL.TOP }
  render(<Cell cell={cell} />);
  const walls = screen.queryAllByTestId("wall")
  expect(walls.length).toBe(1)
});

test("セル内に１が描画される", () => {
  const cell: CellData = { wall: WALL.TOP, value: 1 }
  render(<Cell cell={cell} />);
  expect(screen.getByText("1")).toBeInTheDocument()
});

test("セル内に１，３，５が描画される", () => {
  const candidate: number[] = [1,3,5]
  const cell: CellData = { wall: WALL.TOP, candidate: candidate }
  render(<Cell cell={cell} />);
  expect(screen.getByText(candidate.join(' '))).toBeInTheDocument()
});

test("セルの色はオレンジ", () => {
  const color: string = "orange"
  const cell: CellData = { wall: WALL.TOP, color: color }
  render(<Cell cell={cell} />);
  expect(screen.getByRole("button")).toHaveStyle(`background: ${color}`)
})