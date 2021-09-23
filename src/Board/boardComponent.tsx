import React, { useEffect, useRef, useState } from "react"
import {
    Piece,
    Pawn,
    Rook,
    King,
    Knight,
    Queen,
    Bishop,
} from "../Pieces/pieces"
import { Colors } from "../Constants/colors"
import { BoardRow } from "./board_row"
import { Move } from "../Pieces/pieces"
import { Cemetery } from "./cemetery"
import { Board } from "../board"
import { Status, StatusTab } from "./status"
import {
    MovementType,
    getPieceType,
    createNewBoard,
    getColumnLetter,
    getColumnNumber,
} from "./utils"
import { BoardValues } from "./utils"
import { PawnSwitchDialog } from "../Dialogs/pawnSwitchDialog"
import { Dialog, Button } from "@mui/material"
import useIsMax from "../windowDimension"
import "@fontsource/roboto"
import texture from "../Images/darkTexture.jpeg"
//import { GoogleLoginDialog } from "../Dialogs/googleLogin"
import { 
    getMovements, 
    startEventSource, 
    postMovement, 
    resetMovements 
} from '../Repositories/movementRepository'
import styled from 'styled-components'
/* The board has to have 64 piece in a square 8x8 */

type BoardComponentProps = {
    startBoard: Nullable<Piece>[][],
    _blackTurn: (backTurn: boolean)=>void
}


export const BoardComponent: React.FC<BoardComponentProps> = ({
    startBoard,
    _blackTurn
}) => {
    const isMaxWidth: boolean = useIsMax()
    const blackTurn = useRef<boolean>(false)

    const Board = styled.div`
        display: block;
        background-image: url(${texture});
        background-position: center;
        background-repeat: "repeat";
        padding-bottom: ${isMaxWidth ? "50px" : "5vw"};
        padding-right: ${isMaxWidth ? "50px" : "5vw"};
        color: ${Colors.white};
        font-family: "Roboto";
        border-radius: 5px;
        border-style: solid;
        border-color: ${Colors.black};
        border-width: 1px;
        filter: drop-shadow(2px 2px 2px ${Colors.shadow_gray});
    `

    const BoardWrapper = styled.div`
        display: inline-block;
        width: 100%;
        max-width: 1000px;
        justify-content: center;
        align-items: center;
        margin-left: 50%;
        transform: translate(-50%,0%);
    `

    const TurnBar = styled.div`
        width: 100%;
        height: 5px;
        margin-top: 5px;
        margin-bottom: 5px;
        border-radius: 5px;
        filter: drop-shadow(2px 2px 4px ${Colors.shadow_gray});
        background-color: yellow;
        transition: opacity 3s;
    `

    const TurnBarWhite = styled(TurnBar)`
        opacity: ${blackTurn.current ? 0 : 1};
    `
    const TurnBarBlack = styled(TurnBar)`
        opacity: ${blackTurn.current ? 1 : 0};
    `

    const GameSelectionDialog = styled(Dialog)`
        width: 100%; 
        padding: 20px;
        margin: 20px;
    `

    const MultiplayerDialog = styled(Dialog)`
        width: 100%; 
        padding: 20px;
        margin: 20px;
    `
    const MultiplayerButton = styled(Button)`
        width: 100%; 
        padding: 20px;
        margin: 20px;
        background-color: ${Colors.move_blue};
        border-radius: 5px;
        filter: drop-shadow(2px 2px 4px ${Colors.shadow_gray});
    `

    const [boardValues, setBoardValues] = useState<BoardValues>({
        board: createNewBoard(),
        selected: null,
        movements: [],
        killMovements: [],
        check: null,
        cemetery: [],
        endGame: false,
        iterations: 0,
    })
    const boardValuesRef = useRef<BoardValues>(boardValues)
    const [multiplayer, setMultiplayer] = useState<boolean>(false)
    const [gameSelectionDialog, setGameSelectionDialog] = useState<boolean>(boardValues.iterations === 0)
    const [multiplayerDialog, setMultiplayerDialog] = useState<boolean>(false)
    const [openDialog, setOpenDialog] = useState<IPawnSwitch>({
        open: false,
        isBlack: null,
        position: null,
    })
    const [endDialog, setEndDialog] = useState<boolean>(false)
    const movements = useRef<BoardMovement[]>([])
    const [sseStarted, setSseStarted] = useState<boolean>(false)
    const loading = useRef<boolean>(false)

    useEffect(() => {
        if (boardValuesRef.current.endGame) {
            setEndDialog(true)
        }
        if (!sseStarted && multiplayer) {
            startEventSource((data: number) => {
                updateMovement(data)
            } )
            setSseStarted(true)
        }
        _blackTurn(blackTurn.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardValues])

    function updateMovement(eventNumber: number) {
        if (eventNumber > movements.current.length) {
            if (loading.current === false) {
                loading.current = true
                getMovements((newMovements: BoardMovement[]) => {
                    loading.current = false
                    handleMultiplayerMovement(newMovements)
                })
            }
        } else if (eventNumber === 0 && movements.current.length > 0) {
            loading.current = true
            getMovements((newMovements: BoardMovement[]) => {
                loading.current = false
                handleMultiplayerMovement(newMovements)
            })
        }
    }


    //Mechanics

    function addDirectionalMove(
        piece: Piece,
        position: BoardPosition,
        move: Move,
    ): [Nullable<BoardPosition>, Nullable<BoardPosition>] {
        const columnNumber = getColumnNumber(position.column)! + move.h
        const row = piece.isBlack
            ? position.row - move.v
            : position.row + move.v
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

    function getCheck(board: Board): Nullable<[BoardPosition, BoardPosition]> {
        let piecePositions = []
        var check: Nullable<[BoardPosition, BoardPosition]> = null

        // get piece positions
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j]
                if (piece !== null) {
                    piecePositions.push({
                        column: getColumnLetter(j),
                        row: i + 1,
                    })
                }
            }
        }

        console.table(board)

        // search for kill movements
        piecePositions.forEach((i: BoardPosition) => {
            const piece = board.getPieceFromPosition(i)
            const moves = getMovesForPiece(piece, i)
            moves[1].forEach((j) => {
                const killPiece = board.getPieceFromPosition(j)
                if (killPiece instanceof King) {
                    check = [i, j!]
                }
            })
        })
        return check
    }

    function getMovesForPiece(
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
                    const movement = addDirectionalMove(piece, position, i)
                    possibleMovements.push(movement[0])
                })
            } else {
                piece.movement.moves.forEach((i) => {
                    const movement = addDirectionalMove(piece, position, i)
                    possibleMovements.push(movement[0])
                })
            }
            piece.movement.movesToKill?.forEach((i) => {
                const movement = addDirectionalMove(piece, position, i)
                if (movement[1] !== null) killMovements.push(movement[1])
            })
            return [possibleMovements, killMovements]
        }
        if (piece instanceof King) {
            let castle = canCastle(piece, position)
            if (castle !== null) {
                castle.rookPosition.every((i) => possibleMovements.push(i))
            }
        }
        piece.movement.moves.forEach((i) => {
            if (i.h > 0 && i.v === 0) {
                //right movements
                if (!blockRight) {
                    const movement = addDirectionalMove(piece, position, i)
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
                    const movement = addDirectionalMove(piece, position, i)
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
                    const movement = addDirectionalMove(piece, position, i)
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
                    const movement = addDirectionalMove(piece, position, i)
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
                    const movement = addDirectionalMove(piece, position, i)
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
                    const movement = addDirectionalMove(piece, position, i)
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
                    const movement = addDirectionalMove(piece, position, i)
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
                    const movement = addDirectionalMove(piece, position, i)
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

    function canMove(
        selectedPosition: Nullable<BoardPosition>,
        position: Nullable<BoardPosition>,
    ) {
        var newBoardValues = { ...boardValuesRef.current }
        if (newBoardValues.movements === null) return
        const movementMatch = newBoardValues.movements.filter((i) => {
            if (i?.column !== null && i?.row !== null) {
                return (
                    i?.column === position?.column && i?.row === position?.row
                )
            }
            return false
        })
        if (movementMatch.length > 0) {
            if (multiplayer) {
                postMovement({
                    type: MovementType.Movement,
                    from: `${selectedPosition!.column}${selectedPosition!.row}`,
                    to: `${position!.column}${position!.row}`,
                })
            } else {
                movePiece(selectedPosition!, position!)
                movements.current.push({
                    type: MovementType.Movement,
                    from: `${selectedPosition!.column}${selectedPosition!.row}`,
                    to: `${position!.column}${position!.row}`,
                })
            }
        }
    }

    function movePiece(positionA: BoardPosition, positionB: BoardPosition) {
        const newBoardValues = { ...boardValuesRef.current }
        const piece: Nullable<Piece> =
            newBoardValues.board.getPieceFromPosition(positionA)

        newBoardValues.board.removePieceFromPosition(positionA)

        // remove first move from the pawn / king / rook
        if (piece !== null && piece.movement !== null) {
            piece.movement.firstMove = null
        }

        newBoardValues.board.addPieceToPosition(piece!, positionB)

        // does check still exist
        if (newBoardValues.check !== null) {
            const checkPiece = newBoardValues.board.getPieceFromPosition(
                newBoardValues.check[0],
            )
            if (checkPiece !== null) {
                getMovesForPiece(
                    checkPiece,
                    newBoardValues.check[0],
                )[1].forEach((i) => {
                    const killPiece =
                        newBoardValues.board.getPieceFromPosition(i)
                    if (killPiece instanceof King) {
                        newBoardValues.endGame = true
                    }
                })
                if (newBoardValues.endGame === false)
                    newBoardValues.check = null
            }
        }

        checkPawnSwitch(piece!, positionB)

        newBoardValues.check = getCheck(newBoardValues.board)
        console.log(`isBlackTurn: ${blackTurn}`)

        newBoardValues.selected = null
        newBoardValues.movements = []
        newBoardValues.killMovements = []

        blackTurn.current = !blackTurn.current

        boardValuesRef.current = newBoardValues
        setBoardValues(newBoardValues)
    }

    function killMove(positionA: BoardPosition, positionB: BoardPosition) {
        const newBoardValues = { ...boardValuesRef.current }
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
        newBoardValues.check = getCheck(newBoardValues.board)
        newBoardValues.endGame = deadPiece instanceof King
        newBoardValues.iterations++
        blackTurn.current = !blackTurn.current
        boardValuesRef.current = newBoardValues
        setBoardValues(newBoardValues)

        checkPawnSwitch(killerPiece!, positionB)
    }

    function canCastle(
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

    function castle(kingPosition: BoardPosition, rookPosition: BoardPosition) {
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
            (i) =>
                i.column === rookPosition.column && i.row === rookPosition.row,
        )
        console.log(`castleIndex ${castleIndex}`)
        let newBoardValues = { ...boardValues }
        const newKingPosition: BoardPosition = newKingPositions[castleIndex]
        const newRookPosition: BoardPosition = newRookPositions[castleIndex]
        const rook: Piece | null =
            newBoardValues.board.getPieceFromPosition(rookPosition)
        const king: Piece | null =
            newBoardValues.board.getPieceFromPosition(kingPosition)
        if (rook === null) return
        if (rook.movement === null) return
        if (king === null) return
        if (king.movement === null) return
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
        blackTurn.current = !blackTurn.current
        newBoardValues.killMovements = []
        newBoardValues.iterations++

        //New way
        if(multiplayer) {
            postMovement({
                type: MovementType.Castle,
                from: `${kingPosition.column}${kingPosition.row}`,
                to: `${rookPosition.column}${rookPosition.row}`,
            })
        } else {
            movements.current.push({
                type: MovementType.Castle,
                from: `${kingPosition.column}${kingPosition.row}`,
                to: `${rookPosition.column}${rookPosition.row}`,
            })
        }

        boardValuesRef.current = newBoardValues
        setBoardValues(newBoardValues)
    }

    function checkPawnSwitch(piece: Piece, position: BoardPosition) {
        if (piece instanceof Pawn) {
            if (piece.isBlack && position.row === 1) {
                setOpenDialog({ open: true, isBlack: true, position: position })
            }
            if (!piece.isBlack && position.row === 8) {
                setOpenDialog({
                    open: true,
                    isBlack: false,
                    position: position,
                })
            }
        }
    }

    function pawnSwitchPiece(piece: Piece, position: BoardPosition) {
        setOpenDialog({ open: false, isBlack: null, position: null })
        var newBoardValues = { ...boardValuesRef.current }

        const pieceOnPosition =
            newBoardValues.board.getPieceFromPosition(position)
        if (pieceOnPosition instanceof Pawn) {
            postMovement({
                type: `${getPieceType(piece)}`,
                from: `${position.column}${position.row}`,
                to: `${position.column}${position.row}`,
            })
            newBoardValues.board.removePieceFromPosition(position)
            newBoardValues.board.addPieceToPosition(piece, position)
            newBoardValues.check = getCheck(newBoardValues.board)
            newBoardValues.iterations++
            boardValuesRef.current = newBoardValues
            setBoardValues(newBoardValues)
        }
    }

    function handleSelected(position: BoardPosition) {
        const newBoardValues = { ...boardValuesRef.current }
        const board: Board = newBoardValues.board
        const selectedPiece = board.getPieceFromPosition(
            newBoardValues.selected,
        )
        const piece = board.getPieceFromPosition(position)

        //isSelected?
        if (newBoardValues.selected === null) {
            if (piece !== null) {
                if (piece.isBlack === blackTurn.current) {
                    newBoardValues.selected = position
                    const moves = getMovesForPiece(piece, position)
                    newBoardValues.movements = moves[0]
                    newBoardValues.killMovements = moves[1]
                    newBoardValues.iterations++
                    boardValuesRef.current = newBoardValues
                    setBoardValues(newBoardValues)
                    return
                }
            }
        } else {
            //selected same
            if (
                newBoardValues.selected.row === position.row &&
                newBoardValues.selected.column === position.column
            ) {
                return
            }

            //selected other
            if (piece !== null) {
                if (piece.isBlack === selectedPiece?.isBlack) {
                    //handle castle
                    if (
                        selectedPiece instanceof King &&
                        piece instanceof Rook
                    ) {
                        if (
                            selectedPiece.movement?.firstMove !== null &&
                            piece.movement?.firstMove !== null
                        ) {
                            castle(newBoardValues.selected!, position)
                            return
                        }
                    }
                    //selected new piece
                    newBoardValues.selected = position
                    //setMovements
                    const moves = getMovesForPiece(piece, position)
                    newBoardValues.movements = moves[0]
                    newBoardValues.killMovements = moves[1]
                    moves[1].forEach((i) => {
                        const killPiece =
                            newBoardValues.board.getPieceFromPosition(i)
                        if (killPiece instanceof King) {
                            newBoardValues.check = [position, i!]
                        }
                    })
                    newBoardValues.iterations++
                    boardValuesRef.current = newBoardValues
                    setBoardValues(newBoardValues)
                    return
                } else {
                    // if it is a kill move
                    const isKillMove: boolean =
                        newBoardValues.killMovements.filter(
                            (i) =>
                                i?.column === position.column &&
                                i.row === position.row,
                        ).length > 0
                    if (isKillMove) {
                        if (multiplayer) {
                            postMovement({
                                type: MovementType.Kill,
                                from: `${newBoardValues.selected!.column}${newBoardValues.selected!.row}`,
                                to: `${position!.column}${position!.row}`,
                            })
                        } else killMove(newBoardValues.selected!, position)
                        return
                    }
                }
            } else {
                // there is a selected piece, and user selected a movement square
                canMove(newBoardValues.selected!, position)
            }
        }
    }

    //end Mechanics

    function resetBoard() {
        setEndDialog(false)
        setOpenDialog({ open: false, isBlack: null, position: null })
        var newBoardValues = { ...boardValuesRef.current }
        newBoardValues.board = createNewBoard()
        newBoardValues.selected = null
        newBoardValues.movements = []
        newBoardValues.killMovements = []
        newBoardValues.check = null
        newBoardValues.cemetery = []
        newBoardValues.endGame = false
        newBoardValues.iterations++

        blackTurn.current = false 

        if(multiplayer) {
            resetMovements(() => {
                movements.current = []
                boardValuesRef.current = newBoardValues
                setBoardValues(newBoardValues)
            })
        } else {
            movements.current = []
            boardValuesRef.current = newBoardValues
            setBoardValues(newBoardValues)

        }
    }

    function handleMultiplayerMovement(eventMovements: BoardMovement[]) {
        try {
            if (eventMovements.length === 0) {
                resetBoard()
                return
            }

            const eventLastMove: BoardMovement =
                eventMovements[eventMovements.length - 1]
            if (movements.current.length > 0) {
                const lastMove: BoardMovement =
                    movements.current[movements.current.length - 1]
                if (lastMove.from === eventLastMove.from) {
                    return
                }
            }

            const numberOfMovesAhead = eventMovements.length - movements.current.length

            const movesAhead : BoardMovement[] = eventMovements.slice(eventMovements.length - numberOfMovesAhead)
            
            movesAhead.forEach((i) => {
                const positionA: BoardPosition = {
                    column: i.from[0],
                    row: parseInt(i.from[1]),
                }
                const positionB: BoardPosition = {
                    column: i.to[0],
                    row: parseInt(i.to[1]),
                }

                switch (eventLastMove.type) {
                    case MovementType.Movement:
                        movePiece(positionA, positionB)
                        break
                    case MovementType.Kill:
                        killMove(positionA, positionB)
                        break
                    case MovementType.Castle:
                        castle(positionA, positionB)
                        break
                    case MovementType.Rook:
                        pawnSwitchPiece(new Rook(!blackTurn.current), positionA)
                        break
                    case MovementType.Knight:
                        pawnSwitchPiece(new Knight(!blackTurn.current), positionA)
                        break
                    case MovementType.Bishop:
                        pawnSwitchPiece(new Bishop(!blackTurn.current), positionA)
                        break
                    case MovementType.Queen:
                        pawnSwitchPiece(new Queen(!blackTurn.current), positionA)
                        break
                }
                movements.current = eventMovements
            })
        } catch {
            console.log("Catch error on SSE")
        }
    }


    function renderRow(rowNumber: number) {
        var newBoardValues = { ...boardValuesRef.current }
        return (
            <div className="boardRowFlex" style={{ display: "flex" }}>
                <div
                    className="boardRowNumber"
                    style={{
                        display: "flex",
                        width: "8%",
                        justifyContent: "center",
                        alignSelf: "center",
                        paddingTop: rowNumber === 8 ? 50 : 0,
                        filter: `drop-shadow(2px,2px,2px, ${Colors.shadow_gray})`,
                    }}
                >
                    {rowNumber}
                </div>
                <BoardRow
                    rowNumber={rowNumber}
                    pieces={newBoardValues.board[rowNumber - 1]}
                    selected={newBoardValues.selected}
                    canMove={newBoardValues.movements}
                    canKill={newBoardValues.killMovements}
                    check={newBoardValues.check}
                    onSelected={(boardPosition: BoardPosition) =>
                        handleSelected(boardPosition)
                    }
                />
            </div>
        )
    }

    const rowNumbers = [8, 7, 6, 5, 4, 3, 2, 1]

    return (
        <BoardWrapper>
            <TurnBarBlack />
            <Board>
                {renderRow(rowNumbers[0])}
                {renderRow(rowNumbers[1])}
                {renderRow(rowNumbers[2])}
                {renderRow(rowNumbers[3])}
                {renderRow(rowNumbers[4])}
                {renderRow(rowNumbers[5])}
                {renderRow(rowNumbers[6])}
                {renderRow(rowNumbers[7])}
            </Board>
            <TurnBarWhite />
            <Cemetery cemetery={boardValues.cemetery} />
            <StatusTab
                isBlack={blackTurn.current}
                status={boardValues.check ? Status.CHECK : Status.TURN}
                restart={() => resetBoard()}
            />
            <PawnSwitchDialog
                open={openDialog}
                handleClose={(piece, position) =>
                    pawnSwitchPiece(piece, position)
                }
            />
            <Dialog open={endDialog}>
                <div style={{ padding: 20 }}>
                    Game over - {blackTurn.current ? "Black" : "White"} won
                </div>
                <Button onClick={() => resetBoard()}>Restart</Button>
            </Dialog>
            <GameSelectionDialog 
                open={gameSelectionDialog}
                fullWidth={true}
                >
                <MultiplayerButton onClick={() => {
                    setMultiplayer(false)
                    setGameSelectionDialog(false)
                    setMultiplayerDialog(true)
                }}>
                    Single Player
                </MultiplayerButton>
                <MultiplayerButton onClick={()=>{
                    setMultiplayer(true)
                    setGameSelectionDialog(false)
                }}>
                    Multiplayer
                </MultiplayerButton>
            </GameSelectionDialog>
            <MultiplayerDialog
                open={multiplayerDialog}
            >
                <h1>Information on how to play multiplayer</h1>
                <CodeGenerator />

                <h1>If you wanna join a game</h1>
                <input type="text"></input>

            </MultiplayerDialog>
            
        </BoardWrapper>
    )
}
//<GoogleLoginDialog open={true}/>
