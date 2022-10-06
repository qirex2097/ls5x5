import React from 'react'
import { Field } from './components/Field'
import { Commands } from './components/Commands'
import './App.css';
import { useGame } from './hooks/useGame'


function App() {
  const [field, commandNo, commands, commandPanel, handleCellClick, selectCommand, selectCommand2] = useGame()

  return (<div className="App" id="App">
    <Field field={field} handleClick={handleCellClick} />
    <Commands commands={commands} commandNo={commandNo} selectCommand={selectCommand} />
    <Commands commands={commandPanel} selectCommand={selectCommand2} />
  </div>);
}

export default App;
