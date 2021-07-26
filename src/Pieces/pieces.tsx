
export type Move = {
    v: number,
    h: number
}

export type Movement = {
    onlyForward: boolean
    canJump: boolean
    moves: Move[]
    movesToKill: Move[]
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
            onlyForward: true,
            canJump: false, 
            moves: [{v:1,h:0}],
            movesToKill: [{v:1,h:1}]
         }
        this.image = 'P'
    }   
}

export class Hook extends Piece {
    constructor(isBlack: boolean) {
        super(isBlack)
        this.movement = { 
            onlyForward: false,
            canJump: false, 
            moves: [
                {v:1,h:0}, 
                {v:2,h:0}, 
                {v:3,h:0},
                {v:4,h:0},
                {v:5,h:0},
                {v:6,h:0},
                {v:7,h:0},
                {v:0,h:1},
                {v:0,h:2},
                {v:0,h:3},
                {v:0,h:4},
                {v:0,h:5},
                {v:0,h:6},
                {v:0,h:7},
            ],
            movesToKill: [
                {v:1,h:0}, 
                {v:2,h:0}, 
                {v:3,h:0},
                {v:4,h:0},
                {v:5,h:0},
                {v:6,h:0},
                {v:7,h:0},
                {v:0,h:1},
                {v:0,h:2},
                {v:0,h:3},
                {v:0,h:4},
                {v:0,h:5},
                {v:0,h:6},
                {v:0,h:7},
            ]
         }
        this.image = 'H'
    }   
}

export class Knight extends Piece {
    constructor(isBlack: boolean) {
        super(isBlack)
        this.movement = { 
            onlyForward: false,
            canJump: true, 
            moves: [
                {v:1,h:2},
                {v:2,h:1}
            ],
            movesToKill: [
                {v:1,h:2},
                {v:2,h:1}
            ]
        }
        this.image = 'KN'
    }   
}

export class Bishop extends Piece {
    constructor(isBlack: boolean){
        super(isBlack)
        this.movement = { 
            onlyForward: false,
            canJump: false, 
            moves: [
                {v:1,h:1},
                {v:2,h:2},
                {v:3,h:3},
                {v:4,h:4},
                {v:5,h:5},
                {v:6,h:6},
                {v:7,h:7},
            ],
            movesToKill: [
                {v:1,h:1},
                {v:2,h:2},
                {v:3,h:3},
                {v:4,h:4},
                {v:5,h:5},
                {v:6,h:6},
                {v:7,h:7},
            ]
        }
        this.image = 'B'
    }
}

export class Queen extends Piece {
    constructor(isBlack: boolean){
        super(isBlack)
        this.movement = { 
            onlyForward: false, 
            canJump: false,
            moves: [
                {v:1,h:1},
                {v:2,h:2},
                {v:3,h:3},
                {v:4,h:4},
                {v:5,h:5},
                {v:6,h:6},
                {v:7,h:7},
                {v:1,h:0}, 
                {v:2,h:0}, 
                {v:3,h:0},
                {v:4,h:0},
                {v:5,h:0},
                {v:6,h:0},
                {v:7,h:0},
                {v:0,h:1},
                {v:0,h:2},
                {v:0,h:3},
                {v:0,h:4},
                {v:0,h:5},
                {v:0,h:6},
                {v:0,h:7},
            ],
            movesToKill: [
                {v:1,h:1},
                {v:2,h:2},
                {v:3,h:3},
                {v:4,h:4},
                {v:5,h:5},
                {v:6,h:6},
                {v:7,h:7},
                {v:1,h:0}, 
                {v:2,h:0}, 
                {v:3,h:0},
                {v:4,h:0},
                {v:5,h:0},
                {v:6,h:0},
                {v:7,h:0},
                {v:0,h:1},
                {v:0,h:2},
                {v:0,h:3},
                {v:0,h:4},
                {v:0,h:5},
                {v:0,h:6},
                {v:0,h:7},
            ]
        }
        this.image = 'Q'
    }
}

export class King extends Piece {
    constructor(isBlack: boolean){
        super(isBlack)
        this.movement = { 
            onlyForward: false, 
            canJump: false,
            moves: [
                {v:1,h:1},
                {v:0,h:1},
                {v:1,h:0},
            ],
            movesToKill: [
                {v:1,h:1},
                {v:0,h:1},
                {v:1,h:0},
            ]
        }
        this.image = 'K'
    }

}