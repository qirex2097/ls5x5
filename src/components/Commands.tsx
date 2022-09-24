import './Commands.css'
import { CommandData } from '../game'

type CommandDataJSX = CommandData & {
  contents: string
  style: { [key: string]: string }
}

type CommandProps = {
  command: CommandDataJSX
  onClick: () => void
  isSelected: boolean
  testId: string
}

const Command = (props: CommandProps) => {
  return <button
    data-testid={props.testId}
    className={props.isSelected ? "command selected" : "command"}
    style={props.command.style}
    onClick={props.onClick}>
    {props.command.contents ? props.command.contents : ''}
  </button>
}

type CommandsProps = {
  commands: CommandDataJSX[]
  commandNo: number
  selectCommand: (i: number) => void
}

const Commands = (props: CommandsProps) => {
  let commandElements: JSX.Element[] = []

  commandElements = props.commands.map((v, i) => {
    return <Command key={i}
      command={v}
      testId={`command-${i}`}
      onClick={() => props.selectCommand(i)} isSelected={props.commandNo === i} />
  })

  return <div className="commands" data-testid="commands">{commandElements}</div>
}

export type { CommandDataJSX }
export { Commands }