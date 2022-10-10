import React from 'react'
import { CellData, WALL } from "../game"
import "./Cell.css"

type CellProps = {
  cell: CellData
  onClick: () => void
}

const Cell: React.FC<CellProps> = ({ cell, onClick }: CellProps) => {
  let wallElements: JSX.Element[] = []
  const wall = cell.wall

  if (wall & WALL.TOP) { wallElements = [...wallElements, <div key="top" className="wall top" data-testid="wall" />] }
  if (wall & WALL.LEFT) { wallElements = [...wallElements, <div key="left" className="wall left" data-testid="wall" />] }
  if (wall & WALL.RIGHT) { wallElements = [...wallElements, <div key="right" className="wall right" data-testid="wall" />] }
  if (wall & WALL.BOTTOM) { wallElements = [...wallElements, <div key="bottom" className="wall bottom" data-testid="wall" />] }

  let valueElement: JSX.Element = <></>
  if (cell.value) {
    valueElement = <span className="cell value">{cell.value}</span>
  } else if (cell.candidate) {
    valueElement = <span className="cell candidate">{cell.candidate!.join(' ')}</span>
  } else {
    valueElement = <span className="cell candidate" style={{color: "transparent"}}>{""}</span>
  }

  let color: { background: string } = { background: "transparent" }
  if (cell.color) {
    color = { background: cell.color }
  }

  return (<div data-testid="cell" className="cell" style={color} onPointerDown={(e) => {e.preventDefault(); onClick() }}>{wallElements}{valueElement}</div>)
}

export { Cell }