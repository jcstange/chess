import React, { useState }from 'react'
import ReactDOM from 'react-dom'
import { Board } from './Board/board'

const Game: React.FC = () => {
    return (
    <div className="game" style={{ height: '100%', width: '100%'}}>
        <div className="game-board" style={{ height: '100%', width: '100%'}}>
            <Board />
        </div>
    </div>)
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
)