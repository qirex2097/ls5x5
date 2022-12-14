import React from "react";
import * as G from '../game'
import { CellData, FieldData } from '../game'
import { CommandLooks } from "../components/Commands";
import * as UR from '../undo'
import { UndoRedo, } from "../undo";

const toggleValue = (cell: CellData, value: number): CellData | null => {
  if (cell.isHint) return null;

  if (cell.value && cell.value === value) {
    return { ...cell, value: undefined };
  } else {
    return { ...cell, value: value };
  }
};
const toggleCandidate = (cell: CellData, value: number): CellData | null => {
  if (cell.value && 1 <= cell.value) return null;

  if (cell.candidate) {
    if (cell.candidate.indexOf(value) < 0) {
      return G.addCandidate(cell, value);
    } else {
      return G.removeCandidate(cell, value);
    }
  } else {
    return G.addCandidate(cell, value);
  }
};
const toggleColor = (cell: CellData, color: string): CellData | null => {
  if (cell.color) {
    if (cell.color === color) {
      return { ...cell, color: undefined };
    } else {
      return { ...cell, color: color };
    }
  } else {
    return { ...cell, color: color };
  }
};

const deleteValueCandidateColor = (cell: CellData): CellData | null => {
  if (cell.isHint && !cell.color) return null
  const value: number | undefined = cell.isHint ? cell.value : undefined
  return {
    ...cell,
    value: value,
    candidate: undefined,
    color: undefined,
  };
}
type CellCommand = CommandLooks & {
  func: (cell: CellData) => CellData | null;
};

const candidateColor: string = "lightgrey";
const commands: CellCommand[] = [
  {
    contents: "1",
    className: "value",
    func: (cell: CellData) => {
      return toggleValue(cell, 1);
    },
  },
  {
    contents: "2",
    className: "value",
    func: (cell: CellData) => {
      return toggleValue(cell, 2);
    },
  },
  {
    contents: "3",
    className: "value",
    func: (cell: CellData) => {
      return toggleValue(cell, 3);
    },
  },
  {
    contents: "4",
    className: "value",
    func: (cell: CellData) => {
      return toggleValue(cell, 4);
    },
  },
  {
    contents: "5",
    className: "value",
    func: (cell: CellData) => {
      return toggleValue(cell, 5);
    },
  },
  {
    className: "candidate",
    contents: (
      <>
        <span>1&nbsp;</span>
        <span style={{ color: candidateColor }}> 2 3 4 5</span>
      </>
    ),
    func: (cell: CellData) => {
      return toggleCandidate(cell, 1);
    },
  },
  {
    className: "candidate",
    contents: (
      <>
        <span style={{ color: candidateColor }}>1 </span>
        <span>&nbsp;2&nbsp;</span>
        <span style={{ color: candidateColor }}> 3 4 5</span>
      </>
    ),
    func: (cell: CellData) => {
      return toggleCandidate(cell, 2);
    },
  },
  {
    className: "candidate",
    contents: (
      <>
        <span style={{ color: candidateColor }}>1 2 </span>
        <span>&nbsp;3&nbsp;</span>
        <span style={{ color: candidateColor }}> 4 5</span>
      </>
    ),
    func: (cell: CellData) => {
      return toggleCandidate(cell, 3);
    },
  },
  {
    className: "candidate",
    contents: (
      <>
        <span style={{ color: candidateColor }}>1 2 3 </span>
        <span>&nbsp;4&nbsp;</span>
        <span style={{ color: candidateColor }}> 5</span>
      </>
    ),
    func: (cell: CellData) => {
      return toggleCandidate(cell, 4);
    },
  },
  {
    className: "candidate",
    contents: (
      <>
        <span style={{ color: candidateColor }}>1 2 3 4 </span>
        <span>&nbsp;5</span>
      </>
    ),
    func: (cell: CellData) => {
      return toggleCandidate(cell, 5);
    },
  },
  {
    contents: "",
    style: { background: "lightpink" },
    func: (cell: CellData) => {
      return toggleColor(cell, "lightpink");
    },
  },
  {
    contents: "",
    style: { background: "darksalmon" },
    func: (cell: CellData) => {
      return toggleColor(cell, "darksalmon");
    },
  },
  {
    contents: "",
    style: { background: "yellowgreen" },
    func: (cell: CellData) => {
      return toggleColor(cell, "yellowgreen");
    },
  },
  {
    contents: "",
    style: { background: "orchid" },
    func: (cell: CellData) => {
      return toggleColor(cell, "orchid");
    },
  },
  {
    className: "moji",
    contents: "DELETE",
    style: { fontSize: "24px", background: "lightgreen" },
    func: (cell: CellData) => {
      return deleteValueCandidateColor(cell)
    }
  },
];

type BoardCommand = CommandLooks & {
  func?: (field: FieldData) => FieldData;
};

const useGame = (): [
  field: FieldData,
  commandNo: number,
  commands: CommandLooks[],
  commandPanel: CommandLooks[],
  handleCellClick: (cell: CellData) => void,
  selectCommand: (newCommandNo: number) => void,
  selectCommand2: (idx: number) => void
] => {
  const [field, setField] = React.useState<FieldData>(G.createField());
  const [commandNo, setCommandNo] = React.useState<number>(-1);
  const [state, setState] = React.useState<UndoRedo<CellData[]>>(
    UR.resetAction<CellData[]>(field.cells)
  );

  const commandBackground: string = "orange"
  const undoColor: string = UR.canUndo(state) ? "white" : "lightgrey";
  const redoColor: string = UR.canRedo(state) ? "white" : "lightgrey";
  const commands2: BoardCommand[] = [
    {
      className: "moji",
      contents: "UNDO",
      style: { fontSize: "24px", color: undoColor, background: commandBackground },
      func: (field: FieldData) => {
        const newState: UndoRedo<CellData[]> = UR.undoAction<CellData[]>(state);
        setState(newState);
        return { ...field, cells: newState.current };
      },
    },
    {
      className: "moji",
      contents: "REDO",
      style: { fontSize: "24px", color: redoColor, background: commandBackground },
      func: (field: FieldData) => {
        const newState: UndoRedo<CellData[]> = UR.redoAction<CellData[]>(state);
        setState(newState);
        return { ...field, cells: newState.current };
      },
    },
    { contents: "", style: { background: 'transparent', border: "none" } },
    {
      className: "moji",
      contents: "RETRY",
      style: { fontSize: "24px", background: commandBackground },
      func: (field: FieldData) => {
        const newField: FieldData = G.resetField(field);
        setField(newField)
        setState(UR.setAction<CellData[]>(state, newField.cells))
        return newField
      }
    },
    {
      className: "moji",
      key: "AAA",
      contents: "???FINISH",
      style: { fontSize: "24px", background: commandBackground },
      func: (field: FieldData) => {
        if (G.checkField(field)) return { ...field, solved: true };
        else return field;
      },
    },
  ];

  const command3Background: string = "purple"
  const commands3: BoardCommand[] = [
    {
      className: "moji",
      key: "AAA",   //FINISH ???????????????????????????
      contents: "RETRY",
      style: { fontSize: "24px", background: command3Background },
      func: (field: FieldData) => {
        const newField: FieldData = G.createField();
        setState(UR.resetAction<CellData[]>(newField.cells));
        setCommandNo(-1);
        return newField;
      },
    },
  ];

  /* ????????????????????????????????? */
  const handleCellClick = (cell: CellData): void => {
    if (commandNo < 0 || !commands[commandNo].func) return;
    const newCell: CellData | null = commands[commandNo].func(cell)
    if (!newCell) return;

    const newCells: CellData[] = field.cells.map((v) => {
      if (v === cell) {
        return newCell; //commands[commandNo].func(cell);
      } else {
        return v;
      }
    });
    setField({ ...field, cells: newCells });
    setState(UR.setAction<CellData[]>(state, newCells));
  };
  /* ????????????????????????????????????????????????????????? */
  const selectCommand = (newCommandNo: number) => {
    if (newCommandNo === commandNo) setCommandNo(-1);
    else setCommandNo(newCommandNo);
  };

  /* ????????????????????????????????????????????????????????? */
  const commandPanel: BoardCommand[] = field.solved ? commands3 : commands2;
  const selectCommand2 = (idx: number) => {
    if (!commandPanel[idx].func) return;
    const newField: FieldData = commandPanel[idx].func!(field);
    setField(newField);
  };

  return [
    field,
    commandNo,
    commands,
    commandPanel,
    handleCellClick,
    selectCommand,
    selectCommand2,
  ];
};

export { useGame };
