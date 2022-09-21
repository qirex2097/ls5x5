import { render, screen } from "@testing-library/react";
import { Field } from '../Field'
import { FieldData, CellData, WALL } from '../../game'

const cells: CellData[] = [
    { wall: WALL.NONE }
]

test('Fieldが描画される', () => {
    const field: FieldData = { cells: cells }
    render(<Field field={field}/>)
    expect(screen.getByTestId('field')).toBeInTheDocument()
})

test('Fieldは25のCellを持つ', () => {
    const cells: CellData[] = new Array<CellData>(25).fill({ wall: WALL.NONE })
    const field: FieldData = { cells: cells }
    render(<Field field={field}/>)
    expect(screen.getAllByRole('button').length).toBe(25)
})