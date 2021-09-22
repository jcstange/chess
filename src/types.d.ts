type BoardPosition = {
    column: string
    row: number
}

type Nullable<T> = T | null

type Castle = {
    rookPosition: BoardPosition[]
}

type IPawnSwitch = {
    open: boolean
    isBlack: Nullable<boolean>
    position: Nullable<BoardPosition>
}

type BoardMovement = {
    type: string
    from: string
    to: string
}

type KillMovements = Nullable<BoardPosition>[]
type Movements = Nullable<BoardPosition>[]
type KillMovement = Nullable<BoardPosition>
type Movement = Nullable<BoardPosition>
