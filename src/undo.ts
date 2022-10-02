type UndoRedo<T> = {
  past: T[];
  current: T;
  future: T[];
};

const resetAction = <T>(newPresent: T): UndoRedo<T> => {
  return { past: [], current: newPresent, future: [] };
};

const setAction = <T>(state: UndoRedo<T>, newPresent: T): UndoRedo<T> => {
  const newPast = [...state.past, state.current];
  return { past: newPast, current: newPresent, future: [] };
};

const undoAction = <T>(state: UndoRedo<T>): UndoRedo<T> => {
  if (state.past.length <= 0) return state;

  const newFuture: T[] = [state.current, ...state.future];
  const newCurrent: T = state.past[state.past.length - 1];
  const newPast: T[] = state.past.slice(0, state.past.length - 1);
  return { past: newPast, current: newCurrent, future: newFuture };
};

const redoAction = <T>(state: UndoRedo<T>): UndoRedo<T> => {
  if (state.future.length <= 0) return state;

  const newPast = [...state.past, state.current];
  const newCurrent: T = state.future[0];
  const newFuture: T[] = state.future.slice(1);
  return { past: newPast, current: newCurrent, future: newFuture };
};

const canUndo = <T>(state: UndoRedo<T>): boolean => {
  return state.past.length > 0;
};
const canRedo = <T>(state: UndoRedo<T>): boolean => {
  return state.future.length > 0;
};

export type { UndoRedo };
export { resetAction, setAction, undoAction, redoAction, canUndo, canRedo };
