import { render, screen } from "@testing-library/react";
import { Field } from '../Field'
import { CellData, WALL } from '../../game'

const cells: CellData[] = [
    { wall: WALL.NONE }
]

const dummyCommand = (cell: CellData): CellData => {
    return cell;
}

test('Fieldが描画される', () => {
    render(<Field cells={cells} handleClick={dummyCommand} />)
    expect(screen.getByTestId('field')).toBeInTheDocument()
})

test('Fieldは25のCellを持つ', () => {
    const cells: CellData[] = new Array<CellData>(25).fill({ wall: WALL.NONE })
    render(<Field cells={cells} handleClick={dummyCommand}/>)
    expect(screen.getAllByRole('button').length).toBe(25)
})