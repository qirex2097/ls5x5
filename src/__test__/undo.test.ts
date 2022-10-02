import {
  UndoRedo,
  resetAction,
  setAction,
  undoAction,
  redoAction,
} from "../undo";

test("UNDO", () => {
  let state: UndoRedo<number> = resetAction(1);
  expect(state.current).toBe(1);
  state = setAction(state, 2);
  expect(state.current).toBe(2);
  state = setAction(state, 3);
  state = setAction(state, 4);
  state = setAction(state, 5);
  state = undoAction(state);
  expect(state.current).toBe(4);
  state = undoAction(state);
  expect(state.current).toBe(3);
  state = undoAction(state);
  state = undoAction(state);
  expect(state.current).toBe(1);
  state = redoAction(state);
  expect(state.current).toBe(2);
});
