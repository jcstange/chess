
import { render, cleanup, waitFor, fireEvent } from '@testing-library/react'
import { BoardComponent } from '../Board/boardComponent'
import { Board } from '../board'
import { startBoard, BoardValues, createBoardPosition } from '../Board/utils'
import '@testing-library/jest-dom'
import { Colors } from '../Constants/colors'

beforeAll(()=> cleanup)

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
    const { container } = render(<BoardComponent />)
    let restartButton = container.children[0].children[2]
    fireEvent.click(restartButton)
    await waitFor(() => restartButton)
    expect(piece).toBe(_startBoard[0][0])
})


test('select piece',  () => {
    const { container } = render(<BoardComponent />)
    let board = container.children[0].children[1]
    let boardRow = board.children[7].children[1]
    let square = boardRow.children[0].children[0]
    fireEvent.click(square)

    expect(square).toHaveStyle({backgroundColor: Colors.selected_green})
})

test('move piece',  () => {
    const { container } = render(<BoardComponent />)
    let board = container.children[0].children[1]
    //Select Knight
    let boardRowFrom = board.children[7].children[1]
    let squareFrom = boardRowFrom.children[1].children[0]
    fireEvent.click(squareFrom)

    expect(squareFrom).toHaveStyle({backgroundColor: Colors.selected_green})

    //Move piece and check if it was moved
    let boardRowTo = board.children[5].children[1]
    let squareTo = boardRowTo.children[0].children[0]
    fireEvent.click(squareTo)
    let piece = squareTo.children[0].children[0]

    expect(piece).toHaveClass("pieceImage")

    //Check emptySquare
    let nextSquare = boardRowTo.children[1].children[0]
    let notPiece = nextSquare.children[0].children[0]
    expect(notPiece).toHaveClass("emptySquare")
})