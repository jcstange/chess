import { Piece } from './Pieces/pieces'
import { getColumnNumber } from './Board/utils'

export class Board extends Array<Array<Nullable<Piece>>> {

    history : Nullable<Piece>[][][] = []
    constructor(_startBoard: Nullable<Piece>[][]) {
        super(..._startBoard)
        this.history.push(_startBoard)
    }


    getPieceFromPosition(position: Nullable<BoardPosition>) : Nullable<Piece> {
        if(position == null) return null
        const row: number = position.row - 1
        const column : number = getColumnNumber(position.column)
        const boardPosition : Nullable<Piece> = this[row][column]
        return boardPosition    
    }

    addPieceToPosition(piece: Piece, boardPosition: BoardPosition) {
        this[boardPosition.row -1][getColumnNumber(boardPosition.column)] = piece
        this.history.push(this)
    }

    removePieceFromPosition(boardPosition: BoardPosition) {
        this[boardPosition.row - 1][getColumnNumber(boardPosition.column)] = null
    }
}