import React from 'react'
import { Field } from './components/Field'
import { Commands } from './components/Commands'
import { createField, CellData, FieldData, CommandData } from './game';
import './App.css';

function App() {
  const field: FieldData = createField([[0, 1, 2, 3, 5], [10, 15, 20, 21, 22], [16, 17, 18, 23, 24], [4, 9, 13, 14, 19], [6, 7, 8, 11, 12]]);
  const [commandNo, setCommandNo] = React.useState<number>(-1)

  for (let i = 0; i < 25; i++) {
    field.cells[i].value = i + 1
  }

  const commands: CommandData[] = [
    { func: (cell: CellData) => { return { ...cell, value: 1 } } },
    { func: (cell: CellData) => { return { ...cell, value: 2 } } },
    { func: (cell: CellData) => { return { ...cell, value: 3 } } },
    { func: (cell: CellData) => { return { ...cell, value: 4 } } },
    { func: (cell: CellData) => { return { ...cell, value: 5 } } },
  ]

  return (<>
    <div>Learn React</div>
    <Field cells={field.cells} func={commandNo < 0 ? (cell: CellData) => { return cell } : commands[commandNo].func} />
    <Commands commands={commands} commandNo={commandNo}
      selectCommand={(newCommandNo: number) => { if (newCommandNo === commandNo) setCommandNo(-1); else setCommandNo(newCommandNo) }} />
  </>);
}

export default App;
