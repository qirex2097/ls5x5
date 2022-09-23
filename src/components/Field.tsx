import React from 'react'
import { CellData } from '../game'
import { Cell } from './Cell'
import './Field.css'

type FieldProps = {
    cells: CellData[]
    func: (cell: CellData) => CellData
}

const Field: React.FC<FieldProps> = (props: FieldProps) => {
    const [cells, setCells] = React.useState<CellData[]>(props.cells)

    const onClick = (cell: CellData) => {
        const newCells: CellData[] = cells.map((v) => {
            if (v === cell) {
                return props.func(cell)
            } else {
                return v;
            }
        })
        setCells(newCells)
//        console.log(`Field:onClick:value=${cell.value}`)
    }

    let cellElements: JSX.Element[] = []
    cells.forEach((cell, index) => {
        const cellElement: JSX.Element = <Cell key={index} cell={cell} onClick={() => onClick(cell)} />
        cellElements = [...cellElements, cellElement]
    })
    return (<div data-testid="field" className="field">{cellElements}</div>)
}

export { Field }
