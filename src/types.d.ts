interface BoardPosition {
    column: string,
    row: number,
}

type Nullable<T> = T | null

type Castle = {
    rookPosition: BoardPosition[]
}
