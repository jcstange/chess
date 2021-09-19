import {
    Piece,
    Pawn,
    Rook,
    Bishop,
    Knight,
    Queen,
    King,
} from "../Pieces/pieces"
import { Board } from "../board"

export const startBoard: Nullable<Piece>[][] = [
    [
        new Rook(false),
        new Knight(false),
        new Bishop(false),
        new Queen(false),
        new King(false),
        new Bishop(false),
        new Knight(false),
        new Rook(false),
    ],
    [
        new Pawn(false),
        new Pawn(false),
        new Pawn(false),
        new Pawn(false),
        new Pawn(false),
        new Pawn(false),
        new Pawn(false),
        new Pawn(false),
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
        new Pawn(true),
        new Pawn(true),
        new Pawn(true),
        new Pawn(true),
        new Pawn(true),
        new Pawn(true),
        new Pawn(true),
        new Pawn(true),
    ],
    [
        new Rook(true),
        new Knight(true),
        new Bishop(true),
        new Queen(true),
        new King(true),
        new Bishop(true),
        new Knight(true),
        new Rook(true),
    ],
]

export function getColumnNumber(column: string): number {
    const columns = ["A", "B", "C", "D", "E", "F", "G", "H"]
    for (let i = 0; i < columns.length; i++) {
        if (column === columns[i]) {
            return i
        }
    }
    // eslint-disable-next-line no-throw-literal
    throw "Column doesn't exist"
}

export function getColumnLetter(column: number): string {
    const columns = ["A", "B", "C", "D", "E", "F", "G", "H"]
    return columns[column]
}

export function createBoardPosition(
    boardPosition: string,
): Nullable<BoardPosition> {
    if (getColumnNumber(boardPosition[0]) === null) return null
    if (Number(boardPosition[1]) <= 0 && Number(boardPosition[1]) < 8)
        return null
    return { column: boardPosition[0], row: Number(boardPosition[1]) }
}

export type BoardValues = {
    board: Board
    selected: Nullable<BoardPosition>
    movements: Nullable<BoardPosition>[]
    killMovements: Nullable<BoardPosition>[]
    check: Nullable<[BoardPosition, BoardPosition]>
    cemetery: Piece[]
    endGame: boolean
    iterations: number
}

export function createNewBoard(): Board {
    const _startBoard: Nullable<Piece>[][] = startBoard
        .slice()
        .map((i: Nullable<Piece>[]) =>
            i.slice().map((piece: Nullable<Piece>) => {
                if (piece !== null) {
                    if (piece instanceof Pawn) {
                        return new Pawn(piece.isBlack)
                    }
                    if (piece instanceof Rook) {
                        return new Rook(piece.isBlack)
                    }
                    if (piece instanceof Knight) {
                        return new Knight(piece.isBlack)
                    }
                    if (piece instanceof Bishop) {
                        return new Bishop(piece.isBlack)
                    }
                    if (piece instanceof Queen) {
                        return new Queen(piece.isBlack)
                    }
                    if (piece instanceof King) {
                        return new King(piece.isBlack)
                    }
                    return null
                } else return null
            }),
        )
    return new Board(_startBoard)
}

export function getPieceType(piece: Piece): string {
    var pieceType: string = ""
    if (piece instanceof Rook) {
        pieceType = MovementType.Rook
    }
    if (piece instanceof Knight) {
        pieceType = MovementType.Knight
    }
    if (piece instanceof Bishop) {
        pieceType = MovementType.Bishop
    }
    if (piece instanceof Queen) {
        pieceType = MovementType.Queen
    }
    return pieceType
}

export enum MovementType {
    Movement = "movement",
    Kill = "kill",
    Castle = "castle",
    Rook = "rook",
    Knight = "knight",
    Bishop = "bishop",
    Queen = "queen",
}
