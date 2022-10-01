import { render, screen } from "@testing-library/react";
import { Field } from '../Field'
import { FieldData, CellData, createField } from '../../game'

const dummyCommand = (cell: CellData): CellData => {
  return cell;
}

test('Fieldが描画される', () => {
  const field: FieldData = createField()

  render(<Field field={field} handleClick={dummyCommand} />)
  expect(screen.getByTestId('field')).toBeInTheDocument()
})

test('Fieldは25のCellを持つ', () => {
  const field: FieldData = createField()

  render(<Field field={field} handleClick={dummyCommand} />)
  expect(screen.getAllByRole('button').length).toBe(25)
})