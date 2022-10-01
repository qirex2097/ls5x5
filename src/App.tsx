import React from 'react'
import { Field } from './components/Field'
import { Commands, CommandLooks } from './components/Commands'
import { createField, CellData, FieldData, addCandidate, removeCandidate, checkField } from './game';
import './App.css';

const toggleValue = (cell: CellData, value: number): CellData => {
  if (cell.value && cell.value === value) {
    return { ...cell, value: undefined }
  } else {
    return { ...cell, value: value }
  }
}
const toggleCandidate = (cell: CellData, value: number): CellData => {
  if (cell.candidate) {
    if (cell.candidate.indexOf(value) < 0) {
      return addCandidate(cell, value)
    } else {
      return removeCandidate(cell, value)
    }
  } else {
    return addCandidate(cell, value)
  }
}
const toggleColor = (cell: CellData, color: string): CellData => {
  if (cell.color) {
    if (cell.color === color) {
      return { ...cell, color: undefined }
    } else {
      return { ...cell, color: color }
    }
  } else {
    return { ...cell, color: color }
  }
}

type CellCommand = CommandLooks & {
  func: (cell: CellData) => CellData;
}

const candidateColor: string = "lightgrey"
const commands: CellCommand[] = [
  {
    contents: "1", className: "value",
    func: (cell: CellData) => { return toggleValue(cell, 1) }
  },
  {
    contents: "2", className: "value",
    func: (cell: CellData) => { return toggleValue(cell, 2) }
  },
  {
    contents: "3", className: "value",
    func: (cell: CellData) => { return toggleValue(cell, 3) }
  },
  {
    contents: "4", className: "value",
    func: (cell: CellData) => { return toggleValue(cell, 4) }
  },
  {
    contents: "5", className: "value",
    func: (cell: CellData) => { return toggleValue(cell, 5) }
  },
  {
    className: "candidate",
    contents: <><span>1</span><span style={{ color: candidateColor }}> 2 3 4 5</span></>,
    func: (cell: CellData) => { return toggleCandidate(cell, 1) }
  },
  {
    className: "candidate",
    contents: <><span style={{ color: candidateColor }}>1 </span><span>2</span><span style={{ color: candidateColor }}> 3 4 5</span></>,
    func: (cell: CellData) => { return toggleCandidate(cell, 2) }
  },
  {
    className: "candidate",
    contents: <><span style={{ color: candidateColor }}>1 2 </span><span>3</span><span style={{ color: candidateColor }}> 4 5</span></>,
    func: (cell: CellData) => { return toggleCandidate(cell, 3) }
  },
  {
    className: "candidate",
    contents: <><span style={{ color: candidateColor }}>1 2 3 </span><span>4</span><span style={{ color: candidateColor }}> 5</span></>,
    func: (cell: CellData) => { return toggleCandidate(cell, 4) }
  },
  {
    className: "candidate",
    contents: <><span style={{ color: candidateColor }}>1 2 3 4 </span><span>5</span></>,
    func: (cell: CellData) => { return toggleCandidate(cell, 5) }
  },
  { contents: "", style: { background: "lightpink" }, func: (cell: CellData) => { return toggleColor(cell, "lightpink") } },
  { contents: "", style: { background: "mediumorchid" }, func: (cell: CellData) => { return toggleColor(cell, "mediumorchid") } },
  { contents: "", style: { background: "slateblue" }, func: (cell: CellData) => { return toggleColor(cell, "slateblue") } },
  { contents: "", style: { background: "darksalmon" }, func: (cell: CellData) => { return toggleColor(cell, "darksalmon") } },
  { className: "value", contents: "CLEAR", style: { fontSize: "28px", background: "lightgreen" }, func: (cell: CellData) => { return { ...cell, value: undefined, candidate: undefined, color: undefined } } },
]

type BoardCommand = CommandLooks & {
  func?: (field: FieldData) => void
}

const background: string = "khaki"
const commandStyle: { [key: string]: string } = { background: "white", fontSize: "64px", fontFamily: "monospace" }
const commands2: BoardCommand[] = [
  { contents: "↪️", style: commandStyle, },
  { contents: "↩️", style: commandStyle, },
  { contents: "", style: { background: background, border: "none" }, },
  { contents: "", style: { background: background, border: "none" }, },
  { contents: "✔️", style: commandStyle, func: (field: FieldData) => { if (checkField(field)) console.log(`OK`); else console.log(`NG`) } },
]

function App() {
  const [field, setField] = React.useState<FieldData>(createField())
  const [commandNo, setCommandNo] = React.useState<number>(-1)

  /* セルが押された時の処理 */
  const handleCellClick = (cell: CellData): void => {
    if (commandNo < 0 || !commands[commandNo].func) return;

    const newCells: CellData[] = field.cells.map((v) => {
      if (v === cell) {
        return commands[commandNo].func(cell)
      } else {
        return v;
      }
    })
    setField({ ...field, cells: newCells })
  }
  /* 上段のコマンドパネルが押された時の処理 */
  const selectCommand = (newCommandNo: number) => {
    if (newCommandNo === commandNo) setCommandNo(-1);
    else setCommandNo(newCommandNo);
  }
  /* 下段のコマンドパネルが押された時の処理 */
  const selectCommand2 = (idx: number) => {
    if (commands2[idx].func) commands2[idx].func!(field)
  }

  const bodyColor: string = checkField(field) ? "purple" : background
  return (<div className="App" style={{ margin: 0, padding: "10px", background: bodyColor, position: "relative" }}>
    <Field cells={field.cells} handleClick={handleCellClick} />
    <Commands commands={commands} commandNo={commandNo} selectCommand={selectCommand} />
    <Commands commands={commands2} selectCommand={selectCommand2} />
  </div>);
}

export default App;
