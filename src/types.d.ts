import{ Board } from './board'

type BoardValues = {
    board: Board,
    selected: Nullable<BoardPosition>,
    movements: Nullable<BoardPosition>[],
    killMovements: Nullable<BoardPosition>[],
    isBlackTurn: boolean
    check: Nullable<[ BoardPosition, BoardPosition ]>,
    cemetery: Piece[],
    endGame: boolean
} 

type BoardPosition = {
    column: string,
    row: number
}

type Nullable<T> = (T|null)

type Castle = {
    rookPosition: BoardPosition[]
}
