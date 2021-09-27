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
import { Cemetery } from "./cemetery"
import { Board } from "../board"
import { Status, StatusTab } from "./status"
import { MovementType, getPieceType, createNewBoard } from "./utils"
import {
    getCheck,
    getMovesForPiece,
    resetBoardValues,
    castle,
    pawnSwitchPiece,
    killMove,
} from "./board_mechanics"
import { BoardValues } from "./board_mechanics"
import { PawnSwitchDialog } from "../stories/Dialogs/pawnSwitchDialog"
import { Dialog, Button } from "@mui/material"
import useIsMax from "../windowDimension"
import "@fontsource/roboto"
import texture from "../stories/assets/darkTexture.jpeg"
//import { GoogleLoginDialog } from "../Dialogs/googleLogin"
import {
    getMovements,
    startEventSource,
    postMovement,
    resetMovements,
} from "../Repositories/movementRepository"
import styled from "styled-components"
import { TurnBarWhite, TurnBarBlack } from "../stories/Components/TurnBar"
import { JoinGameDialog } from "../stories/Dialogs/JoinGameDialog"
import { GameSelectionDialog } from "../stories/Dialogs/GameSelectionDialog"
import { CreateGameDialog } from "../stories/Dialogs/CreateGameDialog"
/* The board has to have 64 piece in a square 8x8 */

type BoardComponentProps = {
    startBoard: Nullable<Piece>[][]
    _blackTurn: (backTurn: boolean) => void
}

export const BoardComponent: React.FC<BoardComponentProps> = ({
    startBoard,
    _blackTurn,
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
        transform: translate(-50%, 0%);
    `

    const FlexDiv = styled.div`
        display: flex;
    `

    const RowNumber = styled.div<{ rowNumber: number }>`
        display: flex;
        width: 8%;
        justify-content: center;
        align-self: center;
        padding-top: ${(p) => (p.rowNumber === 8 ? 50 : 0)}px;
        filter: drop-shadow(2px, 2px, 2px, ${Colors.shadow_gray});
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
    const [gameSelectionDialog, setGameSelectionDialog] = useState<boolean>(
        boardValues.iterations === 0,
    )
    const [multiplayerDialog, setMultiplayerDialog] = useState<boolean>(false)
    const [createGameDialog, setCreateGameDialog] = useState<boolean>(false)
    const [joinGameDialog, setJoinGameDialog] = useState<boolean>(false)
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
            })
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
                    newBoardValues,
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

        newBoardValues.check = getCheck(newBoardValues)
        console.log(`isBlackTurn: ${blackTurn}`)

        newBoardValues.selected = null
        newBoardValues.movements = []
        newBoardValues.killMovements = []

        blackTurn.current = !blackTurn.current

        boardValuesRef.current = newBoardValues
        setBoardValues(newBoardValues)
    }

    function handleKillMove(
        boardValues: BoardValues,
        positionA: BoardPosition,
        positionB: BoardPosition,
    ) {
        const newBoardValues = killMove(boardValues, positionA, positionB)
        blackTurn.current = !blackTurn.current
        boardValuesRef.current = newBoardValues
        setBoardValues(newBoardValues)

        const killerPiece = newBoardValues.board.getPieceFromPosition(positionA)
        checkPawnSwitch(killerPiece!, positionB)
    }

    function handleCastle(
        boardValues: BoardValues,
        kingPosition: BoardPosition,
        rookPosition: BoardPosition,
    ) {
        const newBoardValues = castle(boardValues, kingPosition, rookPosition)!
        blackTurn.current = !blackTurn.current

        //New way
        if (multiplayer) {
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

    function handlePawnSwitch(
        boardValues: BoardValues,
        piece: Piece,
        position: BoardPosition,
    ) {
        setOpenDialog({ open: false, isBlack: null, position: null })
        var newBoardValues = pawnSwitchPiece(boardValues, piece, position)

        if (newBoardValues === null) return

        postMovement({
            type: `${getPieceType(piece)}`,
            from: `${position.column}${position.row}`,
            to: `${position.column}${position.row}`,
        })
        boardValuesRef.current = newBoardValues
        setBoardValues(newBoardValues)
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
                    const moves = getMovesForPiece(
                        newBoardValues,
                        piece,
                        position,
                    )
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
                            handleCastle(
                                newBoardValues,
                                newBoardValues.selected!,
                                position,
                            )
                            return
                        }
                    }
                    //selected new piece
                    newBoardValues.selected = position
                    //setMovements
                    const moves = getMovesForPiece(
                        newBoardValues,
                        piece,
                        position,
                    )
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
                                from: `${newBoardValues.selected!.column}${
                                    newBoardValues.selected!.row
                                }`,
                                to: `${position!.column}${position!.row}`,
                            })
                        } else
                            handleKillMove(
                                newBoardValues,
                                newBoardValues.selected!,
                                position,
                            )
                        return
                    }
                }
            } else {
                // there is a selected piece, and user selected a movement square
                canMove(newBoardValues.selected!, position)
            }
        }
    }

    function resetBoard() {
        setEndDialog(false)
        setOpenDialog({ open: false, isBlack: null, position: null })
        var newBoardValues = resetBoardValues(boardValuesRef.current)
        blackTurn.current = false

        if (multiplayer) {
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

            const numberOfMovesAhead =
                eventMovements.length - movements.current.length

            const movesAhead: BoardMovement[] = eventMovements.slice(
                eventMovements.length - numberOfMovesAhead,
            )

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
                        handleKillMove(
                            boardValuesRef.current,
                            positionA,
                            positionB,
                        )
                        break
                    case MovementType.Castle:
                        castle(boardValuesRef.current, positionA, positionB)
                        break
                    case MovementType.Rook:
                        handlePawnSwitch(
                            boardValuesRef.current,
                            new Rook(!blackTurn.current),
                            positionA,
                        )
                        break
                    case MovementType.Knight:
                        handlePawnSwitch(
                            boardValuesRef.current,
                            new Knight(!blackTurn.current),
                            positionA,
                        )
                        break
                    case MovementType.Bishop:
                        handlePawnSwitch(
                            boardValuesRef.current,
                            new Bishop(!blackTurn.current),
                            positionA,
                        )
                        break
                    case MovementType.Queen:
                        handlePawnSwitch(
                            boardValuesRef.current,
                            new Queen(!blackTurn.current),
                            positionA,
                        )
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
            <FlexDiv>
                <RowNumber rowNumber={rowNumber}>{rowNumber}</RowNumber>
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
            </FlexDiv>
        )
    }

    const rowNumbers = [8, 7, 6, 5, 4, 3, 2, 1]

    return (
        <BoardWrapper>
            <TurnBarBlack blackTurn={blackTurn.current} />
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
            <TurnBarWhite blackTurn={blackTurn.current} />
            <Cemetery cemetery={boardValues.cemetery} />
            <StatusTab
                isBlack={blackTurn.current}
                status={boardValues.check ? Status.CHECK : Status.TURN}
                restart={() => resetBoard()}
            />
            <PawnSwitchDialog
                open={openDialog}
                handleClose={(piece, position) =>
                    handlePawnSwitch(boardValuesRef.current, piece, position)
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
                textOne="Single Player"
                textTwo="Multi Player"
                clickOne={() => {
                    setMultiplayer(false)
                    setGameSelectionDialog(false)
                }}
                clickTwo={() => {
                    setMultiplayer(true)
                    setGameSelectionDialog(false)
                    setMultiplayerDialog(true)
                }}
            />
            <GameSelectionDialog
                open={multiplayerDialog}
                textOne="Create Game"
                textTwo="Join Game"
                clickOne={() => {
                    setMultiplayerDialog(false)
                    setCreateGameDialog(true)
                }}
                clickTwo={() => {
                    setJoinGameDialog(true)
                    setMultiplayerDialog(false)
                }}
            />
            <CreateGameDialog
                open={createGameDialog}
                buttonClick={() => {
                    setCreateGameDialog(false)
                }}
                backClick={() => {
                    setCreateGameDialog(false)
                    setMultiplayerDialog(true)
                }}
            />
            <JoinGameDialog
                open={joinGameDialog}
                buttonClick={() => {
                    setJoinGameDialog(false)
                }}
                backClick={() => {
                    setJoinGameDialog(false)
                    setMultiplayerDialog(true)
                }}
            />
        </BoardWrapper>
    )
}
//<GoogleLoginDialog open={true}/>
