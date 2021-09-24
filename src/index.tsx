import React from "react"
import ReactDOM from "react-dom"
import styled from "styled-components"
import { BoardComponent } from "./Board/board_component"
import { startBoard } from "./Board/utils"
import { Colors } from './Constants/colors' 

const Game: React.FC = () => {

    const Root = styled.div`
        height: 100%;
        width: 94%;
        margin-left: 3%;
        margin-right: 3%;
    `
    const BoardWrapper = styled.div`
        height: 100%;
        width: 100%;
    `

    function updateBackground(blackTurn: boolean) {
        document.body.style.background = blackTurn ? Colors.shadow_gray : Colors.white
        document.body.style.transition = `background-color 1000ms linear`
    }
    return (
        <Root>
            <BoardWrapper>
                <BoardComponent 
                startBoard={startBoard} 
                _blackTurn={(blackTurn: boolean)=>{ updateBackground(blackTurn) }} 
                />
            </BoardWrapper>
        </Root>
    )
}


ReactDOM.render(<Game/>, document.getElementById("root"))
