type BoardPosition = {
    column: string,
    row: number
}

type Nullable<T> = T | null

type Castle = {
    rookPosition: BoardPosition[]
}

type IPawnSwitch = {
    open: boolean,
    isBlack: Nullable<boolean>,
    position: Nullable<BoardPosition>
}

type BoardMovement = {
    from: string,
    to: string
}
