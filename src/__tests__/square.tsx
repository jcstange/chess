import '@testing-library/react'
import { render, } from '@testing-library/react'
import { Square } from '../Board/square'
import { Board } from '../board'
import { startBoard, BoardValues, createBoardPosition } from '../Board/utils'

test('simple test again', () => {
    expect(1+2).toBe(3)
})

test('test isBlack', () => {
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
    const { container } = render(<Square 
        position={boardPosition}
        piece={boardValues.board.getPieceFromPosition(boardPosition)}
        canMove={false}
        canKill={false}
        selected={false}
        inCheck={false}
        onSelected={()=>null}
    />)


    
    
})