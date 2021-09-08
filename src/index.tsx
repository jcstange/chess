import React from 'react'
import ReactDOM from 'react-dom'
import { BoardComponent } from './Board/boardComponent'
import { startBoard } from './Board/utils'

const Game: React.FC = () => {
    return (
    <div className="game" style={{ height: '100%', width: '100%'}}>
        <div className="game-board" style={{ height: '100%', width: '100%'}}>
            <BoardComponent startBoard={startBoard} />
        </div>
    </div>)
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
)
