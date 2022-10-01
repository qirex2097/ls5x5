import React from 'react'
import { FieldData, CellData } from '../game'
import { Cell } from './Cell'
import './Field.css'

type FieldProps = {
  field: FieldData
  handleClick: (cell: CellData) => void
}

const Field: React.FC<FieldProps> = (props: FieldProps) => {
  const cells: CellData[] = props.field.cells
  let cellElements: JSX.Element[] = []
  cells.forEach((cell, index) => {
    const color: string | undefined = cell.color ? (props.field.solved ? undefined : cell.color) : undefined
    const cellElement: JSX.Element = <Cell key={index} cell={{...cell, color: color}} onClick={() => props.handleClick(cell)} />
    cellElements = [...cellElements, cellElement]
  })
  const style: {[key: string]: string} = props.field.solved ? {background: "khaki"} : {}
  return (<div data-testid="field" className="field" style={style}>{cellElements}</div>)
}

export { Field }
