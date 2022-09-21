import React from 'react'
import { CellData, WALL } from "../game"
import "./Cell.css"

type CellProps = {
  cell: CellData
}

const Cell: React.FC<CellProps> = ({ cell }: CellProps) => {
  let wallElements: JSX.Element[] = []
  const wall = cell.wall

  if (wall & WALL.TOP) { wallElements = [...wallElements, <div key="top" className="wall top" data-testid="wall" />] }
  if (wall & WALL.LEFT) { wallElements = [...wallElements, <div key="left" className="wall left" data-testid="wall" />] }
  if (wall & WALL.RIGHT) { wallElements = [...wallElements, <div key="right" className="wall right" data-testid="wall" />] }
  if (wall & WALL.BOTTOM) { wallElements = [...wallElements, <div key="bottom" className="wall bottom" data-testid="wall" />] }

  let value: JSX.Element = <></>
  if (cell.value) {
    value = <span className="cell value">{cell.value}</span>
  } else if (cell.candidate) {
    value = <span className="cell candidate">{cell.candidate!.join(' ')}</span>
  }

  let color: { background: string } = { background: "transparent" }
  if (cell.color) {
    color = { background: cell.color }
  }

  const handleClicked = () => {
    console.log(`clicked`)
  }

  return (<button data-testid="cell" className="cell" style={color} onClick={handleClicked}>{wallElements}{value}</button>)
}

export { Cell }