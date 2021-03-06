export type Move = {
    v: number
    h: number
}

export type Movement = {
    canJump: boolean
    firstMove: Move[] | null
    moves: Move[]
    movesToKill: Move[] | null
}

export abstract class Piece {
    constructor(isBlack: boolean) {
        this.isBlack = isBlack
        this.movement = null
        this.image = null
    }
    movement: Movement | null
    image: string | null
    isBlack: boolean
}

export class Pawn extends Piece {
    constructor(isBlack: boolean) {
        super(isBlack)
        this.movement = {
            canJump: false,
            firstMove: [
                { v: 1, h: 0 },
                { v: 2, h: 0 },
            ],
            moves: [{ v: 1, h: 0 }],
            movesToKill: [
                { v: 1, h: 1 },
                { v: 1, h: -1 },
            ],
        }
        this.image = "pawn.svg"
    }
}

export class Rook extends Piece {
    constructor(isBlack: boolean) {
        super(isBlack)
        this.movement = {
            canJump: false,
            firstMove: [],
            moves: [
                { v: 1, h: 0 },
                { v: 2, h: 0 },
                { v: 3, h: 0 },
                { v: 4, h: 0 },
                { v: 5, h: 0 },
                { v: 6, h: 0 },
                { v: 7, h: 0 },
                { v: 0, h: 1 },
                { v: 0, h: 2 },
                { v: 0, h: 3 },
                { v: 0, h: 4 },
                { v: 0, h: 5 },
                { v: 0, h: 6 },
                { v: 0, h: 7 },
                { v: -1, h: 0 },
                { v: -2, h: 0 },
                { v: -3, h: 0 },
                { v: -4, h: 0 },
                { v: -5, h: 0 },
                { v: -6, h: 0 },
                { v: -7, h: 0 },
                { v: 0, h: -1 },
                { v: 0, h: -2 },
                { v: 0, h: -3 },
                { v: 0, h: -4 },
                { v: 0, h: -5 },
                { v: 0, h: -6 },
                { v: 0, h: -7 },
            ],
            movesToKill: null,
        }
        this.image = "rook.svg"
    }
}

export class Knight extends Piece {
    constructor(isBlack: boolean) {
        super(isBlack)
        this.movement = {
            canJump: true,
            firstMove: null,
            moves: [
                { v: 1, h: 2 },
                { v: 2, h: 1 },
                { v: -1, h: 2 },
                { v: -2, h: 1 },
                { v: -1, h: -2 },
                { v: -2, h: -1 },
                { v: 1, h: -2 },
                { v: 2, h: -1 },
            ],
            movesToKill: null,
        }
        this.image = "knight.svg"
    }
}

export class Bishop extends Piece {
    constructor(isBlack: boolean) {
        super(isBlack)
        this.movement = {
            canJump: false,
            firstMove: null,
            moves: [
                { v: 1, h: 1 },
                { v: 2, h: 2 },
                { v: 3, h: 3 },
                { v: 4, h: 4 },
                { v: 5, h: 5 },
                { v: 6, h: 6 },
                { v: 7, h: 7 },
                { v: -1, h: 1 },
                { v: -2, h: 2 },
                { v: -3, h: 3 },
                { v: -4, h: 4 },
                { v: -5, h: 5 },
                { v: -6, h: 6 },
                { v: -7, h: 7 },
                { v: -1, h: -1 },
                { v: -2, h: -2 },
                { v: -3, h: -3 },
                { v: -4, h: -4 },
                { v: -5, h: -5 },
                { v: -6, h: -6 },
                { v: -7, h: -7 },
                { v: 1, h: -1 },
                { v: 2, h: -2 },
                { v: 3, h: -3 },
                { v: 4, h: -4 },
                { v: 5, h: -5 },
                { v: 6, h: -6 },
                { v: 7, h: -7 },
            ],
            movesToKill: null,
        }
        this.image = "bishop.svg"
    }
}

export class Queen extends Piece {
    constructor(isBlack: boolean) {
        super(isBlack)
        this.movement = {
            canJump: false,
            firstMove: null,
            moves: [
                //horizontal
                { v: 0, h: 1 },
                { v: 0, h: 2 },
                { v: 0, h: 3 },
                { v: 0, h: 4 },
                { v: 0, h: 5 },
                { v: 0, h: 6 },
                { v: 0, h: 7 },
                { v: 0, h: -1 },
                { v: 0, h: -2 },
                { v: 0, h: -3 },
                { v: 0, h: -4 },
                { v: 0, h: -5 },
                { v: 0, h: -6 },
                { v: 0, h: -7 },
                //vertical
                { v: 1, h: 0 },
                { v: 2, h: 0 },
                { v: 3, h: 0 },
                { v: 4, h: 0 },
                { v: 5, h: 0 },
                { v: 6, h: 0 },
                { v: 7, h: 0 },
                { v: -1, h: 0 },
                { v: -2, h: 0 },
                { v: -3, h: 0 },
                { v: -4, h: 0 },
                { v: -5, h: 0 },
                { v: -6, h: 0 },
                { v: -7, h: 0 },
                //diagonal
                { v: 1, h: 1 },
                { v: 2, h: 2 },
                { v: 3, h: 3 },
                { v: 4, h: 4 },
                { v: 5, h: 5 },
                { v: 6, h: 6 },
                { v: 7, h: 7 },
                { v: -1, h: 1 },
                { v: -2, h: 2 },
                { v: -3, h: 3 },
                { v: -4, h: 4 },
                { v: -5, h: 5 },
                { v: -6, h: 6 },
                { v: -7, h: 7 },
                { v: 1, h: -1 },
                { v: 2, h: -2 },
                { v: 3, h: -3 },
                { v: 4, h: -4 },
                { v: 5, h: -5 },
                { v: 6, h: -6 },
                { v: 7, h: -7 },
                { v: -1, h: -1 },
                { v: -2, h: -2 },
                { v: -3, h: -3 },
                { v: -4, h: -4 },
                { v: -5, h: -5 },
                { v: -6, h: -6 },
                { v: -7, h: -7 },
            ],
            movesToKill: null,
        }
        this.image = "queen.svg"
    }
}

export class King extends Piece {
    constructor(isBlack: boolean) {
        super(isBlack)
        this.movement = {
            canJump: false,
            moves: [
                { v: 1, h: 1 },
                { v: 0, h: 1 },
                { v: 1, h: 0 },
                { v: -1, h: -1 },
                { v: 0, h: -1 },
                { v: -1, h: 0 },
                { v: -1, h: 1 },
                { v: 1, h: -1 },
            ],
            firstMove: [],
            movesToKill: null,
        }
        this.image = "king.svg"
    }
}
