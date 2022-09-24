import React from 'react'
import { Field } from './components/Field'
import { Commands, CommandDataJSX } from './components/Commands'
import { createField, CellData, FieldData, addCandidate, removeCandidate } from './game';
import './App.css';

function App() {
  const field: FieldData = createField()
  const [commandNo, setCommandNo] = React.useState<number>(-1)

  for (let i = 0; i < 5; i++) {
    field.cells[i].value = i + 1
  }

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
        return { ...cell, color: color}
      }
    } else {
      return { ...cell, color: color}
    }
  }

  const commandStyleValue: { [key: string]: string } = { fontSize: "48px" }
  const commandStyle: { [key: string]: string } = { color: "white", fontSize: "24px", textAlign: "left" }
  const commands: CommandDataJSX[] = [
    { contents: "1", style: commandStyleValue, func: (cell: CellData) => { return toggleValue(cell, 1) } },
    { contents: "2", style: commandStyleValue, func: (cell: CellData) => { return toggleValue(cell, 2) } },
    { contents: "3", style: commandStyleValue, func: (cell: CellData) => { return toggleValue(cell, 3) } },
    { contents: "4", style: commandStyleValue, func: (cell: CellData) => { return toggleValue(cell, 4) } },
    { contents: "5", style: commandStyleValue, func: (cell: CellData) => { return toggleValue(cell, 5) } },
    { contents: "1", style: { ...commandStyle, paddingLeft: "10%" }, func: (cell: CellData) => { return toggleCandidate(cell, 1) } },
    { contents: "2", style: { ...commandStyle, paddingLeft: "27%" }, func: (cell: CellData) => { return toggleCandidate(cell, 2) } },
    { contents: "3", style: { ...commandStyle, paddingLeft: "45%" }, func: (cell: CellData) => { return toggleCandidate(cell, 3) } },
    { contents: "4", style: { ...commandStyle, paddingLeft: "67%" }, func: (cell: CellData) => { return toggleCandidate(cell, 4) } },
    { contents: "5", style: { ...commandStyle, paddingLeft: "80%" }, func: (cell: CellData) => { return toggleCandidate(cell, 5) } },
    { contents: "", style: { background: "lightpink" }, func: (cell: CellData) => { return toggleColor(cell, "lightpink") } },
    { contents: "", style: { background: "mediumorchid" }, func: (cell: CellData) => { return toggleColor(cell, "mediumorchid") } },
    { contents: "", style: { background: "slateblue" }, func: (cell: CellData) => { return toggleColor(cell, "slateblue") } },
    { contents: "", style: { background: "darksalmon" }, func: (cell: CellData) => { return toggleColor(cell, "darksalmon") } },
    { contents: "CLEAR", style: { fontSize: "24px", background: "lightgreen" }, func: (cell: CellData) => { return { ...cell, value: undefined, candidate: undefined, color: undefined } } },
  ]

  const handleCellClick = (cell: CellData): CellData => {
    if (commandNo < 0) return cell
    return commands[commandNo].func(cell)
  }

  return (<>
    <Field cells={field.cells} func={handleCellClick} />
    <Commands commands={commands} commandNo={commandNo}
      selectCommand={(newCommandNo: number) => { if (newCommandNo === commandNo) setCommandNo(-1); else setCommandNo(newCommandNo) }} />
  </>);
}

export default App;
