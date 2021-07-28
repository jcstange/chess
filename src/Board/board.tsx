import React, { useState, useEffect } from 'react'
import {
    Piece, 
    Pawn,
    Hook,
    Knight,
    Bishop,
    Queen,
    King
} from '../Pieces/pieces'
import { Colors } from '../Constants/colors'
import { BoardRow } from './board_row'
import { Move } from '../Pieces/pieces'

export type Nullable<T> = (T|null)

export type BoardPosition = {
    column: string,
    row: number
}

type BoardValues = {
    board: Nullable<Piece>[][],
    selected: Nullable<BoardPosition>,
    movements: Nullable<BoardPosition>[],
    killMovements: Nullable<BoardPosition>[]
} 
/* The board has to have 64 piece in a square 8x8 */
export const Board: React.FC = () => {
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
        }
    }

    const startBoard : Nullable<Piece>[][] = [
        [ new Hook(true) , new Knight(true), new Bishop(true), new Queen(true), new King(true), new Bishop(true), new Knight(true), new Hook(true) ],
        [ new Pawn(true) , new Pawn(true)  , new Pawn(true)  , new Pawn(true) , new Pawn(true), new Pawn(true)  , new Pawn(true)  , new Pawn(true) ],
        [ null           , null        , null        , null       , null      , null        , null        , null       ],
        [ null           , null        , null        , null       , null      , null        , null        , null       ],
        [ null           , null        , null        , null       , null      , null        , null        , null       ],
        [ null           , null        , null        , null       , null      , null        , null        , null       ],
        [ new Pawn(false) , new Pawn(false)  , new Pawn(false)  , new Pawn(false) , new Pawn(false), new Pawn(false)  , new Pawn(false)  , new Pawn(false) ],
        [ new Hook(false) , new Knight(false), new Bishop(false), new Queen(false), new King(false), new Bishop(false), new Knight(false), new Hook(false) ]
    ]

    const [ boardValues, setBoardValues ] = useState<BoardValues>({
        board:startBoard,
        selected:null,
        movements:[],
        killMovements: []
    })

    function getColumnNumber(column: string) : number {
        const columns = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]
        for(let i=0; i<columns.length; i++) {
            if(column === columns[i]) {
                return  i
            }
        }
        throw("") 
    }

    function getColumnLetter(column: number) : string {
        const columns = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]
        return columns[column]
    }

    function addDirectionalMove(
        piece: Piece, 
        position: BoardPosition, 
        move: Move
    ) : [ Nullable<BoardPosition>, Nullable<BoardPosition> ] {
        const columnNumber = getColumnNumber(position.column) + move.h 
        const row = piece.isBlack ? position.row + move.v : position.row - move.v
        if(columnNumber < 8 && columnNumber >= 0) {
            const column = getColumnLetter(columnNumber)
            if (row <= 8 && row > 0) {
                const boardPosition = { column: column, row: row }
                const pieceInPosition = getPieceFromPosition(boardPosition)
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

    function getMovesForPiece(
        piece: Nullable<Piece>, 
        position: BoardPosition
    ) : [ Nullable<BoardPosition>[] , Nullable<BoardPosition>[] ]{
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
                    const movement : [ Nullable<BoardPosition>, Nullable<BoardPosition> ]= addDirectionalMove(piece, position, i) 
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
                    const movement : [ Nullable<BoardPosition>, Nullable<BoardPosition> ]= addDirectionalMove(piece, position, i) 
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
        const board = {...boardValues.board}
        const columnA = getColumnNumber(positionA.column)
        const columnB = getColumnNumber(positionB.column)
        const piece = board[positionA.row - 1][columnA]
        console.log(`oldPosition: ${positionA.column}${positionA.row}`)
        board[positionA.row - 1][columnA] = null
        console.log(`newPosition: ${positionB.column}${positionB.row}`)
        board[positionB.row - 1][columnB] = piece
        setBoardValues({...boardValues, board: board, selected: null, movements: []})
    }

    function handleSelected(position: BoardPosition) {
        const newBoardValues = {...boardValues}
        //isSelected?
        const selectedPiece = getPieceFromPosition(newBoardValues.selected)
        const piece = getPieceFromPosition(position)
        if(boardValues.selected === null) {
            if(piece !== null) {
                newBoardValues.selected = position
                const moves = getMovesForPiece(piece,position)
                newBoardValues.movements = moves[0]
                newBoardValues.killMovements = moves[1]
                setBoardValues(newBoardValues)
                return
            }
        } else {
            //selected same 
            if(boardValues.selected.row === position.row && boardValues.selected.column === position.column) {
                return
            }
            //selected other
            if(piece !== null) { //kill or select new
                newBoardValues.selected = position
                //setMovements
                const moves = getMovesForPiece(piece,position)
                newBoardValues.movements = moves[0]
                newBoardValues.killMovements = moves[1]
                setBoardValues(newBoardValues)
                return
            } else {
                // there is a selected piece, but user selected a movement square
                canMove(selectedPiece, position)
            }
        }

        //isKill?

    }

    function getPieceFromPosition(position: Nullable<BoardPosition>) : Nullable<Piece> {
        if(position == null) return null
        const newBoard: Nullable<Piece>[][] = {...boardValues.board}
        const row: number = position.row - 1
        const column : number = getColumnNumber(position.column)
        console.log(`row: ${row} - column: ${column}`)
        const boardPosition : Nullable<Piece> = newBoard[row][column]

        return boardPosition    
    }

    useEffect(() => {
        console.table(boardValues.board)
        if(boardValues.selected === null) return 
    })

    function canMove(piece: Nullable<Piece>, position: Nullable<BoardPosition>) {
        const movementMatch = boardValues.movements.filter((i) => 
            i!.column === position!.column && i!.row === position!.row
        )
        if(movementMatch.length > 0) {
            console.log('moving piece')
            
            movePiece(boardValues!.selected!, position!)
        }
    }

    function resetBoard() {
        setBoardValues({...boardValues, board:startBoard, selected: null, movements: []})
    }


    function renderRow(
        rowNumber: number 
    ) {
        /*
        console.log('renderRow ',  rowNumber)
        let invertedBoard: Nullable<Piece>[][] = []
        for(let i = 7; i>=0; i--) {
            console.log(7-i)
            invertedBoard[7-i] = []
            for(let j=0; i<=7; j++) {
                invertedBoard[7 - i].push(startBoard[i][j])
            }
        }
        */
        return (
        <div style={{display: 'flex'}}>
            <div style={{alignSelf: 'center'}}>{rowNumber}</div>
            <BoardRow 
                rowNumber={rowNumber} 
                pieces={boardValues.board[rowNumber-1]}
                selected={boardValues.selected}
                canMove={boardValues.movements}
                canKill={boardValues.killMovements}
                //isBlocked= {isBlocked()}
                onSelected={(boardPosition: BoardPosition) => handleSelected(boardPosition)}
            />
        </div>
        )
    }
    
    const rowNumbers = [ 8, 7, 6, 5, 4, 3, 2, 1 ]

    return(
    <div style={{ display: 'inline-block', width: '100%'}}>
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
            style={styles.button}
            onClick={() => resetBoard()}>RESET</button>
        </div>
    </div>
    )
}