
import { render, cleanup, waitFor, fireEvent } from '@testing-library/react'
import { BoardComponent } from '../Board/boardComponent'
import { Board } from '../board'
import React from 'react'
import { startBoard, BoardValues, createBoardPosition } from '../Board/utils'
import '@testing-library/jest-dom'
import { Colors } from '../Constants/colors'
import { act } from 'react-dom/test-utils'
import { isJsxText } from 'typescript'

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


test('select piece',  async () => {
    const { container } = render(<BoardComponent />)
    let board = container.children[0].children[1]
    let boardRow = board.children[0].children[1]
    let square = boardRow.children[0].children[1]
    fireEvent.click(square)

    jest.advanceTimersByTime(1000)
    let newSquare = boardRow.children[0].children[1]
    //await waitFor(() => {
        expect(newSquare).toHaveStyle({backgroundColor: Colors.light_brown})
    //})
})