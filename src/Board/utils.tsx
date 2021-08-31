/* eslint-disable @typescript-eslint/no-unused-vars */
import { Piece, Pawn, Rook, Bishop, Knight, Queen, King } from '../Pieces/pieces'

export let startBoard : Nullable<Piece>[][] = [
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
    // eslint-disable-next-line no-throw-literal
    throw("") 
}

export function getColumnLetter(column: number) : string {
    const columns = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]
    return columns[column]
}