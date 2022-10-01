import React from 'react'
import { CellData } from '../game'
import { Cell } from './Cell'
import './Field.css'

type FieldProps = {
  cells: CellData[]
  handleClick: (cell: CellData) => void
}

const Field: React.FC<FieldProps> = (props: FieldProps) => {
  let cellElements: JSX.Element[] = []
  props.cells.forEach((cell, index) => {
    const cellElement: JSX.Element = <Cell key={index} cell={cell} onClick={() => props.handleClick(cell)} />
    cellElements = [...cellElements, cellElement]
  })
  return (<div data-testid="field" className="field">{cellElements}</div>)
}

export { Field }
