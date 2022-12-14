import './Commands.css'

type CommandLooks = {
  contents: string | JSX.Element
  style?: { [key: string]: string }
  className?: string
  key?: string
}

type CommandProps = {
  command: CommandLooks
  onClick: () => void
  isSelected: boolean
  testId: string
}

const Command = (props: CommandProps) => {
  const className: string = `cell command ${props.command.className} ${props.isSelected ? "selected" : ""}`
  return <div
    data-testid={props.testId}
    className={className}
    style={props.command.style}
    onPointerDown={props.onClick}>
    {props.command.contents ? props.command.contents : ''}
  </div>
}

type CommandsProps = {
  commands: CommandLooks[]
  commandNo?: number
  selectCommand: (i: number) => void
}

const Commands = ({commands, commandNo = -1, selectCommand}: CommandsProps) => {
  let commandElements: JSX.Element[] = []

  commandElements = commands.map((v, i) => {
    return <Command key={v.key || i}
      command={v}
      testId={`command-${i}`}
      onClick={() => selectCommand(i)} isSelected={commandNo === i} />
  })

  return <div className="commands" data-testid="commands">{commandElements}</div>
}

export type { CommandLooks }
export { Commands }