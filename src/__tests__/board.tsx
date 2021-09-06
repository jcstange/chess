
import '@testing-library/react'
import { render, waitFor } from '@testing-library/react'
import { BoardComponent } from '../Board/boardComponent'
import { Board } from '../board'
import { startBoard, BoardValues, createBoardPosition } from '../Board/utils'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Colors } from '../Constants/colors'
import { Piece } from '../Pieces/pieces'


test('restart game',  async () => {
    // That's the way to copy an array
    const _startBoard = [...startBoard].map((i) => [...i])
    const boardValues : BoardValues = {
        board: new Board(startBoard),
        selected:null,
        movements:[],
        killMovements: [],
        isBlackTurn: false,
        check: null,
        cemetery: [],
        endGame: false
    }
    const boardPosition : BoardPosition = createBoardPosition('A1')!
    const piece = boardValues.board.getPieceFromPosition(boardPosition)
    boardValues.board.removePieceFromPosition(boardPosition)
    render(<BoardComponent />)
    let contentDiv = document.getElementsByClassName('restart')
    userEvent.click(contentDiv[0])
    const wait = await waitFor(() => contentDiv[0])
    expect(piece).toBe(_startBoard[0][0])
})

test('select piece',  async () => {
    // That's the way to copy an array
    const _startBoard = [...startBoard].map((i) => [...i])
    const boardValues : BoardValues = {
        board: new Board(startBoard),
        selected:null,
        movements:[],
        killMovements: [],
        isBlackTurn: false,
        check: null,
        cemetery: [],
        endGame: false
    }
    render(<BoardComponent />)
    const boardPosition : BoardPosition = createBoardPosition('A1')!
    let contentDiv = document.getElementsByClassName('board')
    let board = contentDiv[0]
    let boardRow = board.children[0].children[1]
    console.debug(boardRow.className)
    let square = boardRow.children[0].children[1]
    console.debug(square.className)
    userEvent.click(square)

    await waitFor(() => board)
    await waitFor(() => expect(boardValues.selected).toBe(boardPosition))
    
})