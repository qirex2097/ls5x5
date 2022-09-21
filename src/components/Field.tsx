import { FieldData } from '../game'
import { Cell } from './Cell'
import './Field.css'

type FieldProps = {
    field: FieldData
}

const Field: React.FC<FieldProps> = ({field}: FieldProps) => {
    let cellElements: JSX.Element[] = []
    field.cells.forEach((cell, index) => {
        const cellElement: JSX.Element = <Cell key={index} cell={cell}/>
        cellElements = [...cellElements, cellElement]
    })
    return (<div data-testid="field" className="field">{cellElements}</div>)
}

export { Field }