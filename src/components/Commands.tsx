import './Commands.css'
import { CommandData } from '../game'

type CommandProps = {
    onClick: () => void
    isSelected: boolean
}

const Command = (props: CommandProps) => {
    return <button className={props.isSelected ? "command selected" : "command"} onClick={props.onClick} />
}

type CommandsProps = {
    commands: CommandData[]
    commandNo: number
    selectCommand: (i: number) => void
}

const Commands = (props: CommandsProps) => {
    let commandElements: JSX.Element[] = []

    commandElements = props.commands.map((v, i) => {
        return <Command key={i} onClick={() => props.selectCommand(i)} isSelected={props.commandNo === i} />
    })
    
    return <div className="commands">{commandElements}</div>
}

export { Commands }