import '@testing-library/react'
import { Square } from '../Board/square'
import { Board } from '../board'

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
    const boardPosition : BoardPosition = { column: 'A', row: 1 }
    const container = (<Square 
        position={boardPosition}
        piece={boardValues.board.getPieceFromPosition(boardPosition)}
        canMove={false}
        canKill={false}
        selected={false}
        inCheck={false}
        onSelected={()=>null}
    />)

    
})