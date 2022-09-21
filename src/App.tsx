import './App.css';
import { Field } from './components/Field'
import { createField, FieldData } from './game';

function App() {
  const field: FieldData = createField([[0,1,2,3,5],[10,15,20,21,22],[16,17,18,23,24],[4,9,13,14,19],[6,7,8,11,12]]);

  for (let i = 0; i < 25; i++) {
    field.cells[i].value = i + 1
  }

  return (<>
    <div>Learn React</div>
    <Field field={field} />
  </>);
}

export default App;
