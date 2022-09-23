import React from 'react'
import { Field } from './components/Field'
import { Commands, CommandDataJSX } from './components/Commands'
import { createField, CellData, FieldData, addCandidate, removeCandidate } from './game';
import './App.css';

function App() {
  const field: FieldData = createField([[0, 1, 2, 3, 5], [10, 15, 20, 21, 22], [16, 17, 18, 23, 24], [4, 9, 13, 14, 19], [6, 7, 8, 11, 12]]);
  const [commandNo, setCommandNo] = React.useState<number>(-1)

  /*
  for (let i = 0; i < 25; i++) {
    field.cells[i].value = i + 1
  }
  */

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

  const commandStyleValue: { [key: string]: string } = { fontSize: "48px" }
  const commandStyle: { [key: string]: string } = { color: "white", fontSize: "24px", textAlign: "left" }
  const commands: CommandDataJSX[] = [
    { contents: "1", style: commandStyleValue, func: (cell: CellData) => { return toggleValue(cell, 1) } },
    { contents: "2", style: commandStyleValue, func: (cell: CellData) => { return { ...cell, value: 2 } } },
    { contents: "3", style: commandStyleValue, func: (cell: CellData) => { return { ...cell, value: 3 } } },
    { contents: "4", style: commandStyleValue, func: (cell: CellData) => { return { ...cell, value: 4 } } },
    { contents: "5", style: commandStyleValue, func: (cell: CellData) => { return { ...cell, value: 5 } } },
    { contents: "1", style: { ...commandStyle, paddingLeft: "10%" }, func: (cell: CellData) => { return toggleCandidate(cell, 1) } },
    { contents: "2", style: { ...commandStyle, paddingLeft: "27%" }, func: (cell: CellData) => { return toggleCandidate(cell, 2) } },
    { contents: "3", style: { ...commandStyle, paddingLeft: "45%" }, func: (cell: CellData) => { return toggleCandidate(cell, 3) } },
    { contents: "4", style: { ...commandStyle, paddingLeft: "67%" }, func: (cell: CellData) => { return toggleCandidate(cell, 4) } },
    { contents: "5", style: { ...commandStyle, paddingLeft: "80%" }, func: (cell: CellData) => { return toggleCandidate(cell, 5) } },
    { contents: "", style: { background: "lightpink" }, func: (cell: CellData) => { return { ...cell, color: "lightpink" } } },
    { contents: "", style: { background: "mediumorchid" }, func: (cell: CellData) => { return { ...cell, color: "mediumorchid" } } },
    { contents: "", style: { background: "slateblue" }, func: (cell: CellData) => { return { ...cell, color: "slateblue" } } },
    { contents: "", style: { background: "darksalmon" }, func: (cell: CellData) => { return { ...cell, color: "darksalmon" } } },
    { contents: "", style: { background: "lightgreen" }, func: (cell: CellData) => { return { ...cell, value: undefined, candidate: undefined, color: undefined } } },
  ]

  return (<>
    <div>Learn React</div>
    <Field cells={field.cells} func={commandNo < 0 ? (cell: CellData) => { return cell } : commands[commandNo].func} />
    <Commands commands={commands} commandNo={commandNo}
      selectCommand={(newCommandNo: number) => { if (newCommandNo === commandNo) setCommandNo(-1); else setCommandNo(newCommandNo) }} />
  </>);
}

export default App;
