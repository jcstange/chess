import { Piece, Pawn, Rook, Bishop, Knight, Queen, King } from '../Pieces/pieces'
import { Board } from '../board'

export const startBoard : Nullable<Piece>[][] = [
    [ new Rook(false) , new Knight(false), new Bishop(false), new Queen(false), new King(false), new Bishop(false), new Knight(false), new Rook(false) ],
    [ new Pawn(false) , new Pawn(false)  , new Pawn(false)  , new Pawn(false) , new Pawn(false), new Pawn(false)  , new Pawn(false)  , new Pawn(false) ],
    [ null           , null        , null        , null       , null      , null        , null        , null       ],
    [ null           , null        , null        , null       , null      , null        , null        , null       ],
    [ null           , null        , null        , null       , null      , null        , null        , null       ],
    [ null           , null        , null        , null       , null      , null        , null        , null       ],
    [ new Pawn(true) , new Pawn(true)  , new Pawn(true)  , new Pawn(true) , new Pawn(true), new Pawn(true)  , new Pawn(true)  , new Pawn(true) ],
    [ new Rook(true) , new Knight(true), new Bishop(true), new Queen(true), new King(true), new Bishop(true), new Knight(true), new Rook(true) ],
]

export function getColumnNumber(column: string) : number {
    const columns = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]
    for(let i=0; i<columns.length; i++) {
        if(column === columns[i]) {
            return  i
        }
    }
    throw("Column doesn't exist") 
}

export function getColumnLetter(column: number) : string {
    const columns = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]
    return columns[column]
}

export function createBoardPosition(boardPosition: string) : Nullable<BoardPosition> {
    if(getColumnNumber(boardPosition[0]) === null) return null
    if(Number(boardPosition[1]) <= 0 && Number(boardPosition[1]) < 8) return null
    return { column: boardPosition[0], row: Number(boardPosition[1]) }
}

export type BoardValues = {
    board: Board,
    selected: Nullable<BoardPosition>,
    movements: Nullable<BoardPosition>[],
    killMovements: Nullable<BoardPosition>[],
    isBlackTurn: boolean
    check: Nullable<[ BoardPosition, BoardPosition ]>,
    cemetery: Piece[],
    endGame: boolean
} 