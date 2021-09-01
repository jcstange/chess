import '@testing-library/react'
import { render } from '@testing-library/react'
import { Square } from '../Board/square'
import { Board } from '../board'
import { startBoard, BoardValues, createBoardPosition } from '../Board/utils'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Colors } from '../Constants/colors'
import { readBuilderProgram } from 'typescript'

test('simple test again', () => {
    expect(1+2).toBe(3)
})

test('test select piece in A1', () => {
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
    const fn = jest.fn()
    const boardPosition : BoardPosition = createBoardPosition('A1')!
    const { container, baseElement } = render(<Square 
        position={boardPosition}
        piece={boardValues.board.getPieceFromPosition(boardPosition)}
        canMove={false}
        canKill={false}
        selected={false}
        inCheck={false}
        onSelected={fn}
    />)
    userEvent.click(baseElement)
    expect(fn).toBeCalled
})

test('test color A1 selected', () => {
    const boardPosition : BoardPosition = createBoardPosition('A1')!
    const boardValues : BoardValues = {
        board: new Board(startBoard),
        selected:boardPosition,
        movements:[],
        killMovements: [],
        isBlackTurn: false,
        check: null,
        cemetery: [],
        endGame: false
    }
    const fn = jest.fn()
    const { baseElement } = render(<Square 
        position={boardPosition}
        piece={boardValues.board.getPieceFromPosition(boardPosition)}
        canMove={false}
        canKill={false}
        selected={true}
        inCheck={false}
        onSelected={fn}
    />)
    expect(baseElement.firstChild).toHaveStyle({backgroundColor: Colors.selected_green})
})

test('test color A1 check', () => {
    const boardPosition : BoardPosition = createBoardPosition('A1')!
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
    const fn = jest.fn()
    const { baseElement } = render(<Square 
        position={boardPosition}
        piece={boardValues.board.getPieceFromPosition(boardPosition)}
        canMove={false}
        canKill={false}
        selected={false}
        inCheck={true}
        onSelected={fn}
    />)
    expect(baseElement).toHaveStyle({backgroundColor: Colors.red})
})

test('test color A1 move', () => {
    const boardPosition : BoardPosition = createBoardPosition('A1')!
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
    const fn = jest.fn()
    const { baseElement } = render(<Square 
        position={boardPosition}
        piece={boardValues.board.getPieceFromPosition(boardPosition)}
        canMove={true}
        canKill={false}
        selected={false}
        inCheck={false}
        onSelected={fn}
    />)
    expect(baseElement).toHaveStyle({backgroundColor: Colors.red})
})