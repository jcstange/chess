import React, { useState } from 'react'
import {
    Piece, 
    Pawn,
    Rook,
    King,
    Knight,
    Queen,
    Bishop
} from '../Pieces/pieces'
import { Colors } from '../Constants/colors'
import { BoardRow } from './board_row'
import { Move } from '../Pieces/pieces'
import { Cemetery } from './cemetery'
import { Board } from '../board'
import { Status, StatusTab } from './status'
import { getColumnLetter, getColumnNumber } from './utils'
import { BoardValues } from './utils'
import { Dialog } from '@mui/material/Dialog'
import { PawnSwitch } from './pawn_switch'
/* The board has to have 64 piece in a square 8x8 */
export const BoardComponent: React.FC = () => {
    const styles = {
        button: {
            marginTop: 30,
            borderWidth: 0,
            color: Colors.white,
            padding: 25,
            backgroundColor: Colors.brown,
            borderRadius: 5,
            width: '50%',
            marginLeft: '25%'
        },
        board: {
            display: 'block',
            width: '90%',
            marginLeft: '5%',
            marginRight: '5%'
        },
        cemetery: {
            marginTop: 30
        }
    }

    const startBoard : Nullable<Piece>[][] = [
        [ new Rook(false) , new Knight(false), new Bishop(false), new Queen(false), new King(false), new Bishop(false), new Knight(false), new Rook(false) ],
        [ new Pawn(false) , new Pawn(false)  , new Pawn(false)  , new Pawn(false) , new Pawn(false), new Pawn(false)  , new Pawn(false)  , new Pawn(false) ],
        [ null           , null        , null        , null       , null      , null        , null        , null       ],
        [ null           , null        , null        , null       , null      , null        , null        , null       ],
        [ null           , null        , null        , null       , null      , null        , null        , null       ],
        [ null           , null        , null        , null       , null      , null        , null        , null       ],
        [ new Pawn(true) , new Pawn(true)  , new Pawn(true)  , new Pawn(true) , new Pawn(true), new Pawn(true)  , new Pawn(true)  , new Pawn(true) ],
        [ new Rook(true) , new Knight(true), new Bishop(true), new Queen(true), new King(true), new Bishop(true), new Knight(true), new Rook(true) ],
    ]

    const [ boardValues, setBoardValues ] = useState<BoardValues>({
        board: new Board(startBoard),
        selected:null,
        movements:[],
        killMovements: [],
        isBlackTurn: false,
        check: null,
        cemetery: [],
        endGame: false
    })

    function addDirectionalMove(
        piece: Piece, 
        position: BoardPosition, 
        move: Move
    ) : [ Nullable<BoardPosition>, Nullable<BoardPosition> ] {
        const columnNumber = getColumnNumber(position.column)! + move.h 
        const row = piece.isBlack ? position.row - move.v : position.row + move.v
        if(columnNumber < 8 && columnNumber >= 0) {
            const column = getColumnLetter(columnNumber)
            if (row <= 8 && row > 0) {
                const boardPosition = { column: column, row: row }
                const pieceInPosition = boardValues.board.getPieceFromPosition(boardPosition)
                if (pieceInPosition == null) {
                    return [ boardPosition, null ]
                } else {
                    if (pieceInPosition.isBlack !== piece.isBlack) {
                       return [ null, boardPosition ] 
                    }
                }
            }
        }
        return [ null, null ]
    }

    function getCheck(
        board: Board 
    ): Nullable<[BoardPosition,BoardPosition]> {
        let piecePositions = []
        var check : Nullable<[BoardPosition,BoardPosition]> = null

        // get piece positions
        for(let i=0; i<8; i++) {
            for(let j=0; j<8; j++) {
                const piece = board[i][j]
                if (piece !== null){
                    piecePositions.push({
                        column: getColumnLetter(j), 
                        row: i + 1
                    })
                }
            }
        }

        console.table(board)

        // search for kill movements
        piecePositions.forEach((i: BoardPosition) => {
            const piece = boardValues.board.getPieceFromPosition(i)
            const moves = getMovesForPiece(piece, i)
            moves[1].forEach((j) => {
                const killPiece = boardValues.board.getPieceFromPosition(j)
                if(killPiece instanceof King) {
                    check = [i , j!]
                }
            })
        })
        return check
    }

    function getMovesForPiece(
        piece: Nullable<Piece>, 
        position: BoardPosition
    ) : [ Nullable<BoardPosition>[], Nullable<BoardPosition>[] ]{
        if(piece === null) return [[],[]]
        if(piece.movement === null) return [[], []]
        let possibleMovements : Nullable<BoardPosition>[] = []
        let killMovements : Nullable<BoardPosition>[] = []
        let blockForward = false
        let blockBackward = false
        let blockLeft = false
        let blockRight = false
        let blockForwardLeftDiagonal = false
        let blockForwardRightDiagonal = false
        let blockBackwardLeftDiagonal = false
        let blockBackwardRightDiagonal = false
        //handle pawn movements
        if(piece instanceof Pawn) {
            if(piece.movement.firstMove !== null) {
                piece.movement.firstMove.forEach((i) => {
                    const movement : [ Nullable<BoardPosition>, Nullable<BoardPosition> ]= addDirectionalMove(piece, position, i) 
                    possibleMovements.push(movement[0])
                })
            } else {
                piece.movement.moves.forEach((i) => {
                    const movement : [ Nullable<BoardPosition>, Nullable<BoardPosition> ]= addDirectionalMove(piece, position, i) 
                    possibleMovements.push(movement[0])
                })
            }
            piece.movement.movesToKill?.forEach((i) => {
                    const movement : [ Nullable<BoardPosition>, Nullable<BoardPosition> ]= addDirectionalMove(piece, position, i) 
                    if(movement[1] !== null) killMovements.push(movement[1])
            })
            return [ possibleMovements, killMovements ]
        }
        if(piece instanceof King){
            let castle = canCastle(piece,position)
            if(castle !== null) {
                castle.rookPosition.every((i) => possibleMovements.push(i))
            }
        } 
        piece.movement.moves.forEach((i) => {
            if(i.h > 0 && i.v === 0) {
                //right movements
                if(!blockRight) {
                    const movement : [ Nullable<BoardPosition>, Nullable<BoardPosition> ]= addDirectionalMove(piece, position, i) 
                    if(movement[0] != null) {
                        possibleMovements.push(movement[0])
                    } else if (movement[1] != null) {
                        killMovements.push(movement[1])
                        blockRight = true
                    } else {
                        blockRight = true
                    }
                }
            }
            if(i.h < 0 && i.v === 0) {
                //left movements
                if(!blockLeft) {
                    const movement : [ Nullable<BoardPosition>, Nullable<BoardPosition> ]= addDirectionalMove(piece, position, i) 
                    if(movement[0] != null) {
                        possibleMovements.push(movement[0])
                    } else if (movement[1] != null) {
                        killMovements.push(movement[1])
                        blockLeft = true
                    } else {
                        blockLeft = true
                    }
                }
            }
            if(i.h === 0 && i.v > 0) {
                //forward movements
                if(!blockForward) {
                    const movement : [ Nullable<BoardPosition>, Nullable<BoardPosition> ]= addDirectionalMove(piece, position, i) 
                    if(movement[0] != null) {
                        possibleMovements.push(movement[0])
                    } else if (movement[1] != null) {
                        killMovements.push(movement[1])
                        blockForward = true
                    } else {
                        blockForward = true
                    }
                }
            }
            if(i.h === 0 && i.v < 0) {
                //backward movements
                if(!blockBackward) {
                    const movement : [ Nullable<BoardPosition>, Nullable<BoardPosition> ]= addDirectionalMove(piece, position, i) 
                    if(movement[0] != null) {
                        possibleMovements.push(movement[0])
                    } else if (movement[1] != null) {
                        killMovements.push(movement[1])
                        blockBackward = true
                    } else {
                        blockBackward = true
                    }
                }
            }
            if(i.h > 0 && i.v < 0) {
                //left backward
                if(piece.movement?.canJump || !blockBackwardRightDiagonal) {
                    const movement : [ Nullable<BoardPosition>, Nullable<BoardPosition> ]= addDirectionalMove(piece, position, i) 
                    if(movement[0] != null) {
                        possibleMovements.push(movement[0])
                    } else if (movement[1] != null) {
                        killMovements.push(movement[1])
                        blockBackwardRightDiagonal = true
                    } else {
                        blockBackwardRightDiagonal = true
                    }
                }
            }
            if(i.h < 0 && i.v < 0) {
                //right backward
                if(piece.movement?.canJump || !blockBackwardLeftDiagonal) {
                    const movement : [ Nullable<BoardPosition>, Nullable<BoardPosition> ]= addDirectionalMove(piece, position, i) 
                    if(movement[0] != null) {
                        possibleMovements.push(movement[0])
                    } else if (movement[1] != null) {
                        killMovements.push(movement[1])
                        blockBackwardLeftDiagonal = true
                    } else {
                        blockBackwardLeftDiagonal = true
                    }
                }
            }
            if(i.h > 0 && i.v > 0) {
                //right forward
                if(piece.movement?.canJump || !blockForwardRightDiagonal) {
                    const movement : [ Nullable<BoardPosition>, Nullable<BoardPosition> ] = addDirectionalMove(piece, position, i) 
                    if(movement[0] != null) {
                        possibleMovements.push(movement[0])
                    } else if (movement[1] != null) {
                        killMovements.push(movement[1])
                        blockForwardRightDiagonal = true
                    } else {
                        blockForwardRightDiagonal = true
                    }
                }
            }
            if(i.h < 0 && i.v > 0) {
                //left forward
                if(piece.movement?.canJump || !blockForwardLeftDiagonal) {
                    const movement : [ Nullable<BoardPosition>, Nullable<BoardPosition> ] = addDirectionalMove(piece, position, i) 
                    if(movement[0] != null) {
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
        return [ possibleMovements, killMovements ]
    }

    function movePiece(
        positionA: BoardPosition, 
        positionB: BoardPosition
    ) {
        const board : Board = boardValues.board
        const piece : Nullable<Piece> = board.getPieceFromPosition(positionA)

        board.removePieceFromPosition(positionA)

        // remove first move from the pawn / king / rook        
        if(piece !== null && piece.movement !== null) {
            piece.movement.firstMove = null 
        }

        board.addPieceToPosition(piece!, positionB)

        // does check still exist
        if(boardValues.check !== null) {
            const checkPiece = board.getPieceFromPosition(boardValues.check[0])
            if(checkPiece !== null) {
                getMovesForPiece(checkPiece, boardValues.check[0])[1].forEach((i) => {
                    const killPiece = board.getPieceFromPosition(i)
                    if(killPiece instanceof King) {
                        boardValues.endGame = true
                    }
                })
                if(boardValues.endGame === false) boardValues.check = null
            }
        }

        if(piece instanceof Pawn) {
            if(piece.isBlack && positionB.row === 0 ) {
                //show black pawn_switch
                //<PawnSwitch isBlack={true} position={positionB} />
            }
            if(!piece.isBlack && positionB.row === 7) {
                //show white pawn_switch
                //<PawnSwitch isBlack={false} position={positionB} />
            }
        }

        boardValues.check = getCheck(board)

        setBoardValues({...boardValues, 
            board: board, 
            selected: null, 
            movements: [], 
            killMovements: [],
            check: boardValues.check,
            endGame: boardValues.endGame,
            isBlackTurn: !boardValues.isBlackTurn,

        })
    }

    function castle(kingPosition: BoardPosition, rookPosition: BoardPosition) {
        const rooks : BoardPosition[] = [ 
            {column: 'A', row: 1}, 
            {column: 'H', row: 1}, 
            {column: 'A', row: 8}, 
            {column: 'H', row: 8} 
        ]
        const newKingPositions : BoardPosition[] = [
            {column: 'C', row: 1},
            {column: 'F', row: 1},
            {column: 'C', row: 8},
            {column: 'F', row: 8},
        ]
        const newRookPositions : BoardPosition[] = [
            {column: "D", row: 1},
            {column: "E", row: 1},
            {column: "D", row: 8},
            {column: "E", row: 8},
        ]
        console.log(`rookPosition ${rookPosition.column}${rookPosition.row}`)
        let castleIndex = rooks.findIndex((i) => i.column === rookPosition.column && i.row === rookPosition.row)
        console.log(`castleIndex ${castleIndex}`)
        let newBoardValues = {...boardValues}
        const newKingPosition : BoardPosition= newKingPositions[castleIndex]
        const newRookPosition : BoardPosition= newRookPositions[castleIndex]
        const rook : Piece | null= newBoardValues.board.getPieceFromPosition(rookPosition)
        const king : Piece | null= newBoardValues.board.getPieceFromPosition(kingPosition)
        if(rook === null) return
        if(rook.movement === null) return
        if(king === null) return
        if(king.movement === null) return
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
        newBoardValues.isBlackTurn = !newBoardValues.isBlackTurn
        newBoardValues.killMovements = []
        setBoardValues({...boardValues,
            board: newBoardValues.board,
            selected: newBoardValues.selected,
            movements: newBoardValues.movements,
            killMovements: newBoardValues.killMovements,
            check: newBoardValues.check,
            cemetery: newBoardValues.cemetery,
            isBlackTurn: newBoardValues.isBlackTurn
        })
    }

    function handleSelected(position: BoardPosition) {
        const newBoardValues = {...boardValues} 
        const board: Board = newBoardValues.board
        const selectedPiece = board.getPieceFromPosition(newBoardValues.selected)
        const piece = board.getPieceFromPosition(position)
    
        //isSelected?
        if(boardValues.selected === null) {
            if(piece !== null) {
                if(piece.isBlack === newBoardValues.isBlackTurn) {
                    newBoardValues.selected = position
                    const moves = getMovesForPiece(piece,position)
                    newBoardValues.movements = moves[0]
                    newBoardValues.killMovements = moves[1]
                    setBoardValues(newBoardValues)
                    return
                }
            }

        } else {

            //selected same 
            if(boardValues.selected.row === position.row 
                && boardValues.selected.column === position.column) {
                return
            }

            //selected other
            if(piece !== null) { 
                if(piece.isBlack === selectedPiece?.isBlack) {
                    //handle castle
                    if (selectedPiece instanceof King && piece instanceof Rook) {
                            if(selectedPiece.movement?.firstMove !== null && piece.movement?.firstMove !== null) {
                                castle(newBoardValues.selected!, position)
                                return
                            }
                    }
                    //selected new piece
                    newBoardValues.selected = position
                    //setMovements
                    const moves = getMovesForPiece(piece,position)
                    newBoardValues.movements = moves[0]
                    newBoardValues.killMovements = moves[1]
                    moves[1].forEach((i) => {
                        const killPiece = newBoardValues.board.getPieceFromPosition(i)
                        if(killPiece instanceof King) {
                            newBoardValues.check = [ position, i! ]
                        }
                    })
                    setBoardValues(newBoardValues)
                    return
                } else {

                    // if it is a kill move
                    if(killMove(newBoardValues, position)) {
                        return
                    }
                }
            } else {
                // there is a selected piece, and user selected a movement square
                canMove(selectedPiece, position)
            }
        }
    }

    function killMove(
        newBoardValues: BoardValues, 
        position: BoardPosition
    ) {
        const selectedPiece = newBoardValues.board.getPieceFromPosition(newBoardValues.selected)
        const isKillMove: boolean = newBoardValues.killMovements.filter((i) => 
            i?.column === position.column && i.row === position.row).length > 0
        if(isKillMove) {
            const selected = newBoardValues!.selected!
            // add to cemetery
            newBoardValues.cemetery.push(newBoardValues.board.getPieceFromPosition(position)!)
            // delete piece
            newBoardValues.board.removePieceFromPosition(selected)
            // remove selected piece 
            newBoardValues.selected = null
            // move piece to killed piece position 

            newBoardValues.board.addPieceToPosition(selectedPiece!, position)
            newBoardValues.movements = []
            newBoardValues.killMovements = []
            newBoardValues.check = getCheck(newBoardValues.board)
            newBoardValues.isBlackTurn = !newBoardValues.isBlackTurn
            setBoardValues({...boardValues,
                board: newBoardValues.board,
                selected: newBoardValues.selected,
                movements: newBoardValues.movements,
                killMovements: newBoardValues.killMovements,
                check: newBoardValues.check,
                cemetery: newBoardValues.cemetery,
                isBlackTurn: newBoardValues.isBlackTurn
            })
            return true
        }
        return false

    }

    function canMove(
        piece: Nullable<Piece>, 
        position: Nullable<BoardPosition>
    ) {
        if(boardValues.movements === null) return
        const movementMatch = boardValues.movements.filter((i) => {
            if(i?.column !== null && i?.row !== null) {
                return i?.column === position?.column && i?.row === position?.row
            }
            return false
        }
        )
        if(movementMatch.length > 0) {
            movePiece(boardValues!.selected!, position!)
        }
    }

    function canCastle(
        king: Piece, 
        kingPosition: BoardPosition
    ): Nullable<Castle> {
        const rookPositions : BoardPosition[] = []
        if(king.movement !== null && king.movement.firstMove !== null) {
           /* 
           1st: king and rook may not been moved
           2nd: all spaces between rook and king must be empty
           3rd: king cannot be in check
           4th: the squares that the king passes over must not be under attack 
           */
           // horizontally finding rook     
            const horizontalMovements = [ 1, 2, 3, 4 ] 
            //movements to right
            for(let i of horizontalMovements) {
                const column = getColumnNumber(kingPosition.column)
                const nextColumn = column! + i
                const nextColumnLetter = getColumnLetter(nextColumn) 
                const boardPosition = {column: nextColumnLetter, row: kingPosition.row}   
                console.log(`checking positive movements ${boardPosition.column}${boardPosition.row}`)
                const piece = boardValues.board.getPieceFromPosition(boardPosition)
                if(piece !== null) {
                    if(!(piece instanceof Rook)) { break }
                    if(piece.movement?.firstMove === null) { break }
                    // rook and king didn't move and there are no pieces between them
                    rookPositions.push(boardPosition)
                    break
                }
            }
            //movements to left
            for(let i of horizontalMovements) {
                const column = getColumnNumber(kingPosition.column)
                const nextColumn = column! - i
                const nextColumnLetter = getColumnLetter(nextColumn) 
                const boardPosition = {column: nextColumnLetter, row: kingPosition.row}   
                console.log(`checking negative movements ${boardPosition.column}${boardPosition.row}`)
                const piece = boardValues.board.getPieceFromPosition(boardPosition)
                if(piece !== null) {
                    if(!(piece instanceof Rook)) { break }
                    if(piece.movement?.firstMove === null) { break }
                    rookPositions.push(boardPosition)
                    break
                }
            }
        } else return null
        if(rookPositions.length > 0) {
            return {
                rookPosition: rookPositions
            } 
        }
        return null
    }

    function resetBoard() {
        setBoardValues({...boardValues, 
            board:new Board(startBoard), 
            selected: null, 
            movements: [], 
            killMovements: [], 
            check: null,
            isBlackTurn: false,
            cemetery: [],
            endGame: false
        })
    }


    function renderRow(
        rowNumber: number 
    ) {
        return (
        <div className="boardRowFlex" style={{display: 'flex'}}>
            <div className="boardRowCenter" style={{alignSelf: 'center'}}>{rowNumber}</div>
            <BoardRow 
                rowNumber={rowNumber} 
                pieces={boardValues.board[rowNumber-1]}
                selected={boardValues.selected}
                canMove={boardValues.movements}
                canKill={boardValues.killMovements}
                check={boardValues.check}
                onSelected={(boardPosition: BoardPosition) => handleSelected(boardPosition)}
            />
        </div>
        )
    }
    
    const rowNumbers = [ 8, 7, 6, 5, 4, 3, 2, 1 ]

    return(
    <div style={{ display: 'inline-block', width: '100%'}}>
        <StatusTab isBlack={boardValues.isBlackTurn} status={boardValues.check ? Status.CHECK : Status.TURN } />
        <div className="board" style={styles.board}>
            {renderRow(rowNumbers[0])}
            {renderRow(rowNumbers[1])}
            {renderRow(rowNumbers[2])}
            {renderRow(rowNumbers[3])}
            {renderRow(rowNumbers[4])}
            {renderRow(rowNumbers[5])}
            {renderRow(rowNumbers[6])}
            {renderRow(rowNumbers[7])}
        </div>
        <div>
            <button 
            className="restart"
            style={styles.button}
            onClick={() => resetBoard()}>RESTART GAME</button>
        </div>
        <div style={styles.cemetery}>
            <Cemetery cemetery={boardValues.cemetery} />
        </div>
        <Dialog>
            <PawnSwitch isBlack={true} position={{column: 'A', row: 1}}/>
            <Button onClick={() => onclose()}>Ok</Button>
        </Dialog>
    </div>
    )
}