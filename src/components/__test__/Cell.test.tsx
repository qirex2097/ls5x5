import { render, screen } from "@testing-library/react";
import { Cell } from "../Cell";
import { CellData, WALL } from "../../game"

test("セルが描画される", () => {
  const cell: CellData = { wall: WALL.NONE, isHint: false }
  render(<Cell cell={cell} onClick={()=>{}}/>);
  expect(screen.getByTestId("cell")).toBeInTheDocument()
});

test("壁がないセルが描画される", () => {
  const cell: CellData = { wall: WALL.NONE, isHint: false }
  render(<Cell cell={cell} onClick={()=>{}}/>);
  const walls = screen.queryAllByTestId("wall")
  expect(walls.length).toBe(0)
});

test("壁が１つのセルが描画される", () => {
  const cell: CellData = { wall: WALL.TOP, isHint: false }
  render(<Cell cell={cell} onClick={()=>{}}/>);
  const walls = screen.queryAllByTestId("wall")
  expect(walls.length).toBe(1)
});

test("セル内に１が描画される", () => {
  const cell: CellData = { wall: WALL.TOP, value: 1, isHint: false }
  render(<Cell cell={cell} onClick={()=>{}}/>);
  expect(screen.getByText("1")).toBeInTheDocument()
});

test("セル内に１，３，５が描画される", () => {
  const candidate: number[] = [1,3,5]
  const cell: CellData = { wall: WALL.TOP, candidate: candidate, isHint: false }
  render(<Cell cell={cell} onClick={()=>{}}/>);
  expect(screen.getByText(candidate.join(' '))).toBeInTheDocument()
});

test("セルの色はオレンジ", () => {
  const color: string = "orange"
  const cell: CellData = { wall: WALL.TOP, color: color, isHint: false }
  render(<Cell cell={cell} onClick={()=>{}}/>);
  expect(screen.getByTestId("cell")).toHaveStyle(`background: ${color}`)
})