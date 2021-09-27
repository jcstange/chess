import { Piece } from "../Pieces/pieces"
import { Board } from "../board"
import { getColumnNumber, getColumnLetter } from "./utils"
import { Move } from "../Pieces/pieces"
import { Pawn, King, Rook } from "../Pieces/pieces"
import { createNewBoard } from "./utils"

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

export function addDirectionalMove(
    boardValues: BoardValues,
    piece: Piece,
    position: BoardPosition,
    move: Move,
): [Nullable<BoardPosition>, Nullable<BoardPosition>] {
    const columnNumber = getColumnNumber(position.column)! + move.h
    const row = piece.isBlack ? position.row - move.v : position.row + move.v
    if (columnNumber < 8 && columnNumber >= 0) {
        const column = getColumnLetter(columnNumber)
        if (row <= 8 && row > 0) {
            const boardPosition = { column: column, row: row }
            const pieceInPosition =
                boardValues.board.getPieceFromPosition(boardPosition)
            if (pieceInPosition == null) {
                return [boardPosition, null]
            } else {
                if (pieceInPosition.isBlack !== piece.isBlack) {
                    return [null, boardPosition]
                }
            }
        }
    }
    return [null, null]
}

export function getCheck(
    boardValues: BoardValues,
): Nullable<[BoardPosition, BoardPosition]> {
    let piecePositions = []
    var check: Nullable<[BoardPosition, BoardPosition]> = null

    // get piece positions
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = boardValues.board[i][j]
            if (piece !== null) {
                piecePositions.push({
                    column: getColumnLetter(j),
                    row: i + 1,
                })
            }
        }
    }

    console.table(boardValues.board)

    // search for kill movements
    piecePositions.forEach((i: BoardPosition) => {
        const piece = boardValues.board.getPieceFromPosition(i)
        const moves = getMovesForPiece(boardValues, piece, i)
        moves[1].forEach((j) => {
            const killPiece = boardValues.board.getPieceFromPosition(j)
            if (killPiece instanceof King) {
                check = [i, j!]
            }
        })
    })
    return check
}

export function getMovesForPiece(
    boardValues: BoardValues,
    piece: Nullable<Piece>,
    position: BoardPosition,
): [Movements, KillMovements] {
    if (piece === null) return [[], []]
    if (piece.movement === null) return [[], []]
    let possibleMovements: Movements = []
    let killMovements: KillMovements = []
    let blockForward = false
    let blockBackward = false
    let blockLeft = false
    let blockRight = false
    let blockForwardLeftDiagonal = false
    let blockForwardRightDiagonal = false
    let blockBackwardLeftDiagonal = false
    let blockBackwardRightDiagonal = false
    //handle pawn movements
    if (piece instanceof Pawn) {
        if (piece.movement.firstMove !== null) {
            piece.movement.firstMove.forEach((i) => {
                const movement = addDirectionalMove(
                    boardValues,
                    piece,
                    position,
                    i,
                )
                possibleMovements.push(movement[0])
            })
        } else {
            piece.movement.moves.forEach((i) => {
                const movement = addDirectionalMove(
                    boardValues,
                    piece,
                    position,
                    i,
                )
                possibleMovements.push(movement[0])
            })
        }
        piece.movement.movesToKill?.forEach((i) => {
            const movement = addDirectionalMove(boardValues, piece, position, i)
            if (movement[1] !== null) killMovements.push(movement[1])
        })
        return [possibleMovements, killMovements]
    }
    if (piece instanceof King) {
        let castle = canCastle(boardValues, piece, position)
        if (castle !== null) {
            castle.rookPosition.every((i) => possibleMovements.push(i))
        }
    }
    piece.movement.moves.forEach((i) => {
        if (i.h > 0 && i.v === 0) {
            //right movements
            if (!blockRight) {
                const movement = addDirectionalMove(
                    boardValues,
                    piece,
                    position,
                    i,
                )
                if (movement[0] != null) {
                    possibleMovements.push(movement[0])
                } else if (movement[1] != null) {
                    killMovements.push(movement[1])
                    blockRight = true
                } else {
                    blockRight = true
                }
            }
        }
        if (i.h < 0 && i.v === 0) {
            //left movements
            if (!blockLeft) {
                const movement = addDirectionalMove(
                    boardValues,
                    piece,
                    position,
                    i,
                )
                if (movement[0] != null) {
                    possibleMovements.push(movement[0])
                } else if (movement[1] != null) {
                    killMovements.push(movement[1])
                    blockLeft = true
                } else {
                    blockLeft = true
                }
            }
        }
        if (i.h === 0 && i.v > 0) {
            //forward movements
            if (!blockForward) {
                const movement = addDirectionalMove(
                    boardValues,
                    piece,
                    position,
                    i,
                )
                if (movement[0] != null) {
                    possibleMovements.push(movement[0])
                } else if (movement[1] != null) {
                    killMovements.push(movement[1])
                    blockForward = true
                } else {
                    blockForward = true
                }
            }
        }
        if (i.h === 0 && i.v < 0) {
            //backward movements
            if (!blockBackward) {
                const movement = addDirectionalMove(
                    boardValues,
                    piece,
                    position,
                    i,
                )
                if (movement[0] != null) {
                    possibleMovements.push(movement[0])
                } else if (movement[1] != null) {
                    killMovements.push(movement[1])
                    blockBackward = true
                } else {
                    blockBackward = true
                }
            }
        }
        if (i.h > 0 && i.v < 0) {
            //left backward
            if (piece.movement?.canJump || !blockBackwardRightDiagonal) {
                const movement = addDirectionalMove(
                    boardValues,
                    piece,
                    position,
                    i,
                )
                if (movement[0] != null) {
                    possibleMovements.push(movement[0])
                } else if (movement[1] != null) {
                    killMovements.push(movement[1])
                    blockBackwardRightDiagonal = true
                } else {
                    blockBackwardRightDiagonal = true
                }
            }
        }
        if (i.h < 0 && i.v < 0) {
            //right backward
            if (piece.movement?.canJump || !blockBackwardLeftDiagonal) {
                const movement = addDirectionalMove(
                    boardValues,
                    piece,
                    position,
                    i,
                )
                if (movement[0] != null) {
                    possibleMovements.push(movement[0])
                } else if (movement[1] != null) {
                    killMovements.push(movement[1])
                    blockBackwardLeftDiagonal = true
                } else {
                    blockBackwardLeftDiagonal = true
                }
            }
        }
        if (i.h > 0 && i.v > 0) {
            //right forward
            if (piece.movement?.canJump || !blockForwardRightDiagonal) {
                const movement = addDirectionalMove(
                    boardValues,
                    piece,
                    position,
                    i,
                )
                if (movement[0] != null) {
                    possibleMovements.push(movement[0])
                } else if (movement[1] != null) {
                    killMovements.push(movement[1])
                    blockForwardRightDiagonal = true
                } else {
                    blockForwardRightDiagonal = true
                }
            }
        }
        if (i.h < 0 && i.v > 0) {
            //left forward
            if (piece.movement?.canJump || !blockForwardLeftDiagonal) {
                const movement = addDirectionalMove(
                    boardValues,
                    piece,
                    position,
                    i,
                )
                if (movement[0] != null) {
                    possibleMovements.push(movement[0])
                } else if (movement[1] != null) {
                    killMovements.push(movement[1])
                    blockForwardLeftDiagonal = true
                } else {
                    blockForwardLeftDiagonal = true
                }
            }
        }
    })
    return [possibleMovements, killMovements]
}

export function canCastle(
    boardValues: BoardValues,
    king: Piece,
    kingPosition: BoardPosition,
): Nullable<Castle> {
    const rookPositions: BoardPosition[] = []
    var newBoardValues = { ...boardValues }
    if (king.movement !== null && king.movement.firstMove !== null) {
        /* 
        1st: king and rook may not been moved
        2nd: all spaces between rook and king must be empty
        3rd: king cannot be in check
        4th: the squares that the king passes over must not be under attack 
        */
        // horizontally finding rook
        const horizontalMovements = [1, 2, 3, 4]
        //movements to right
        for (let i of horizontalMovements) {
            const column = getColumnNumber(kingPosition.column)
            const nextColumn = column! + i
            const nextColumnLetter = getColumnLetter(nextColumn)
            const boardPosition = {
                column: nextColumnLetter,
                row: kingPosition.row,
            }
            const piece =
                newBoardValues.board.getPieceFromPosition(boardPosition)
            if (piece !== null) {
                if (!(piece instanceof Rook)) {
                    break
                }
                if (piece.movement?.firstMove === null) {
                    break
                }
                // rook and king didn't move and there are no pieces between them
                rookPositions.push(boardPosition)
                break
            }
        }
        //movements to left
        for (let i of horizontalMovements) {
            const column = getColumnNumber(kingPosition.column)
            const nextColumn = column! - i
            const nextColumnLetter = getColumnLetter(nextColumn)
            const boardPosition = {
                column: nextColumnLetter,
                row: kingPosition.row,
            }
            const piece =
                newBoardValues.board.getPieceFromPosition(boardPosition)
            if (piece !== null) {
                if (!(piece instanceof Rook)) {
                    break
                }
                if (piece.movement?.firstMove === null) {
                    break
                }
                rookPositions.push(boardPosition)
                break
            }
        }
    } else return null
    if (rookPositions.length > 0) {
        return {
            rookPosition: rookPositions,
        }
    }
    return null
}

export function resetBoardValues(boardValues: BoardValues): BoardValues {
    var newBoardValues = { ...boardValues }
    newBoardValues.board = createNewBoard()
    newBoardValues.selected = null
    newBoardValues.movements = []
    newBoardValues.killMovements = []
    newBoardValues.check = null
    newBoardValues.cemetery = []
    newBoardValues.endGame = false
    newBoardValues.iterations = 0

    return newBoardValues
}

export function castle(
    boardValues: BoardValues,
    kingPosition: BoardPosition,
    rookPosition: BoardPosition,
): Nullable<BoardValues> {
    const rooks: BoardPosition[] = [
        { column: "A", row: 1 },
        { column: "H", row: 1 },
        { column: "A", row: 8 },
        { column: "H", row: 8 },
    ]
    const newKingPositions: BoardPosition[] = [
        { column: "C", row: 1 },
        { column: "F", row: 1 },
        { column: "C", row: 8 },
        { column: "F", row: 8 },
    ]
    const newRookPositions: BoardPosition[] = [
        { column: "D", row: 1 },
        { column: "E", row: 1 },
        { column: "D", row: 8 },
        { column: "E", row: 8 },
    ]
    console.log(`rookPosition ${rookPosition.column}${rookPosition.row}`)
    let castleIndex = rooks.findIndex(
        (i) => i.column === rookPosition.column && i.row === rookPosition.row,
    )
    console.log(`castleIndex ${castleIndex}`)
    let newBoardValues = { ...boardValues }
    const newKingPosition: BoardPosition = newKingPositions[castleIndex]
    const newRookPosition: BoardPosition = newRookPositions[castleIndex]
    const rook: Piece | null =
        newBoardValues.board.getPieceFromPosition(rookPosition)
    const king: Piece | null =
        newBoardValues.board.getPieceFromPosition(kingPosition)
    if (rook === null) return null
    if (rook.movement === null) return null
    if (king === null) return null
    if (king.movement === null) return null
    rook.movement.firstMove = null
    king.movement.firstMove = null
    newBoardValues.board.removePieceFromPosition(rookPosition)
    newBoardValues.board.removePieceFromPosition(kingPosition)
    console.log(`Rook ${rook} : newRookPosition ${newRookPosition}`)
    console.log(`King ${king} : newKingPosition ${newKingPosition}`)
    //TODO: Check how to handle history here
    newBoardValues.board.addPieceToPosition(rook, newRookPosition)
    newBoardValues.board.addPieceToPosition(king, newKingPosition)
    newBoardValues.selected = null
    newBoardValues.movements = []
    newBoardValues.killMovements = []
    newBoardValues.iterations++

    return newBoardValues
}

export function pawnSwitchPiece(
    boardValues: BoardValues,
    piece: Piece,
    position: BoardPosition,
): Nullable<BoardValues> {
    var newBoardValues = { ...boardValues }
    const pieceOnPosition = newBoardValues.board.getPieceFromPosition(position)
    if (pieceOnPosition instanceof Pawn) {
        newBoardValues.board.removePieceFromPosition(position)
        newBoardValues.board.addPieceToPosition(piece, position)
        newBoardValues.check = getCheck(newBoardValues)
        newBoardValues.iterations++
        return newBoardValues
    }
    return null
}

export function killMove(
    boardValues: BoardValues,
    positionA: BoardPosition,
    positionB: BoardPosition,
): BoardValues {
    const newBoardValues = { ...boardValues }
    const killerPiece = newBoardValues.board.getPieceFromPosition(positionA)
    const deadPiece = newBoardValues.board.getPieceFromPosition(positionB)

    newBoardValues.cemetery.push(
        newBoardValues.board.getPieceFromPosition(positionB)!,
    )
    // remove selected piece
    newBoardValues.board.removePieceFromPosition(positionA)
    // move piece to killed piece position
    newBoardValues.board.addPieceToPosition(killerPiece!, positionB)

    newBoardValues.selected = null
    newBoardValues.movements = []
    newBoardValues.killMovements = []
    newBoardValues.check = getCheck(newBoardValues)
    newBoardValues.endGame = deadPiece instanceof King
    newBoardValues.iterations++
    return newBoardValues
}
