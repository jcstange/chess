import React from "react"
import ReactDOM from "react-dom"
import { BoardComponent } from "./Board/boardComponent"
import { startBoard } from "./Board/utils"
import "./index.css"

const Game: React.FC = () => {
    return (
        <div
            className="game"
            style={{
                height: "100%",
                width: "94%",
                marginLeft: "3%",
                marginRight: "3%",
            }}
        >
            <div
                className="game-board"
                style={{ height: "100%", width: "100%" }}
            >
                <BoardComponent startBoard={startBoard} />
            </div>
        </div>
    )
}

ReactDOM.render(<Game />, document.getElementById("root"))
