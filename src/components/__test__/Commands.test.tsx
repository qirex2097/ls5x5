import { fireEvent, render, screen } from "@testing-library/react";
import { CellData } from '../../game'
import { CommandLooks, Commands } from "../Commands";

type CellCommand = CommandLooks & {
  func: (cell: CellData) => CellData;
}

const commandData: CellCommand[] = [
    { contents: "", style: {}, func: (cell: CellData): CellData => { return cell }},
    { contents: "1", style: {}, func: (cell: CellData): CellData => { return cell }},
    { contents: "2", style: {background: 'red'}, func: (cell: CellData): CellData => { return cell }},
    { contents: "3", style: {}, func: (cell: CellData): CellData => { return cell }},
    { contents: "4", style: {}, func: (cell: CellData): CellData => { return cell }},
]

test("コマンドパネルが描画される", () => {
  render(<Commands commands={commandData} commandNo={-1} selectCommand={(i: number) => {}}/>)
  expect(screen.getByTestId("commands")).toBeInTheDocument()
})

test("コマンドパネルは５つのボタンを持つ", () => {
  render(<Commands commands={commandData} commandNo={-1} selectCommand={(i: number) => {}}/>)
  expect(screen.getAllByRole("button").length).toBe(5)
})

test("１番コマンドのコンテンツは１", () => {
  const commandNo: number = 1;
  const testId: string = `command-${commandNo}`
  render(<Commands commands={commandData} commandNo={-1} selectCommand={(i: number) => {}}/>)
  expect(screen.getByTestId(testId)).toHaveTextContent(commandData[commandNo].contents as string)
})

test("２番コマンドのコンテンツは background: red", () => {
  const commandNo: number = 2;
  const testId: string = `command-${commandNo}`
  render(<Commands commands={commandData} commandNo={-1} selectCommand={(i: number) => {}}/>)
  expect(screen.getByTestId(testId)).toHaveStyle(commandData[commandNo].style!)
})

test("選択中コマンドのスタイル", () => {
  const selectedCommandNo: number = 3;
  const testId: string = `command-${selectedCommandNo}`
  render(<Commands commands={commandData} commandNo={selectedCommandNo} selectCommand={(i: number) => {}}/>)
  expect(screen.getByTestId(testId)).toHaveClass('selected')
})

test("押されたボタンのidx番号を返す", () => {
  let commandNo: number = -1
  const pushedCommandNo: number = 3;
  const testId: string = `command-${pushedCommandNo}`
  render(<Commands commands={commandData} commandNo={commandNo} selectCommand={(i: number) => {commandNo = i}}/>)
  expect(commandNo).not.toBe(pushedCommandNo)
  fireEvent.click(screen.getByTestId(testId))
  expect(commandNo).toBe(pushedCommandNo)
})