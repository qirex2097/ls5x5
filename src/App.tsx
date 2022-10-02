import React from 'react'
import { Field } from './components/Field'
import { Commands, CommandLooks } from './components/Commands'
import { createField, CellData, FieldData, addCandidate, removeCandidate, checkField } from './game';
import './App.css';
import { UndoRedo, resetAction, setAction, undoAction, redoAction, canUndo, canRedo } from './undo'

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
  { contents: "", style: { background: "darksalmon" }, func: (cell: CellData) => { return toggleColor(cell, "darksalmon") } },
  { contents: "", style: { background: "slateblue" }, func: (cell: CellData) => { return toggleColor(cell, "slateblue") } },
  { contents: "", style: { background: "mediumorchid" }, func: (cell: CellData) => { return toggleColor(cell, "mediumorchid") } },
  { className: "moji", contents: "DELETE", style: { fontSize: "24px", background: "lightgreen" }, func: (cell: CellData) => { return { ...cell, value: undefined, candidate: undefined, color: undefined } } },
]

type BoardCommand = CommandLooks & {
  func?: (field: FieldData) => FieldData
}


function App() {
  const [field, setField] = React.useState<FieldData>(createField())
  const [commandNo, setCommandNo] = React.useState<number>(-1)
  const [state, setState] = React.useState<UndoRedo<CellData[]>>(resetAction<CellData[]>(field.cells))


  const background: string = "khaki"
  const undoColor: string = canUndo(state) ? "white" : "lightgrey"
  const redoColor: string = canRedo(state) ? "white" : "lightgrey"
  const commands2: BoardCommand[] = [
    {
      className: "moji",
      contents: "UNDO", style: { fontSize: "24px", color: undoColor, background: "orange" },
      func: (field: FieldData) => {
        const newState: UndoRedo<CellData[]> = undoAction<CellData[]>(state)
        setState(newState)
        return { ...field, cells: newState.current }
      }
    },
    {
      className: "moji",
      contents: "REDO", style: { fontSize: "24px", color: redoColor, background: "orange" },
      func: (field: FieldData) => {
        const newState: UndoRedo<CellData[]> = redoAction<CellData[]>(state)
        setState(newState)
        return { ...field, cells: newState.current }
      }
    },
    { contents: "", style: { background: background, border: "none" }, },
    { contents: "", style: { background: background, border: "none" }, },
    {
      className: "moji", key: "AAA",
      contents: "️FINISH", style: { fontSize: "24px", background: "orange" },
      func: (field: FieldData) => {
        if (field.solved) return createField();
        if (checkField(field)) return { ...field, solved: true }; else return field
      },
    },
  ]

  const commands3: BoardCommand[] = [
    {
      className: "moji", key: "AAA",
      contents: "RETRY", style: { fontSize: "24px", background: "purple" },
      func: (field: FieldData) => {
        const newField: FieldData = createField();
        setState(resetAction<CellData[]>(newField.cells))
        return newField;
      }
    },
  ]

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
    setState(setAction<CellData[]>(state, newCells))
  }
  /* 上段のコマンドパネルが押された時の処理 */
  const selectCommand = (newCommandNo: number) => {
    if (newCommandNo === commandNo) setCommandNo(-1);
    else setCommandNo(newCommandNo);
  }

  /* 下段のコマンドパネルが押された時の処理 */
  const commandPanel: BoardCommand[] = field.solved ? commands3 : commands2
  const selectCommand2 = (idx: number) => {
    if (!commandPanel[idx].func) return
    const newField: FieldData = commandPanel[idx].func!(field)
    setField(newField)
  }

  return (<div className="App" style={{ margin: 0, padding: "10px", background: background, position: "relative" }}>
    <Field field={field} handleClick={handleCellClick} />
    <Commands commands={commands} commandNo={commandNo} selectCommand={selectCommand} />
    <Commands commands={commandPanel} selectCommand={selectCommand2} />
  </div>);
}

export default App;
