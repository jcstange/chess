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

export type Nullable<T> = (T|null)

export type BoardPosition = {
    column: string,
    row: number
}

type BoardValues = {
    board: Nullable<Piece>[][],
    selected: Nullable<BoardPosition>,
    movements: Nullable<BoardPosition>[]
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
        movements:[]
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

    function getMovesForPiece(piece: Nullable<Piece>, position: BoardPosition) : Nullable<BoardPosition>[]{
        if(piece === null) return []
        if(piece.movement === null) return []
        let possibleMovements : Nullable<BoardPosition>[] = []
        let killMovements : Nullable<BoardPosition>[] = []
        let blockForward = false
        let blockForwardDiagonal = false
        let blockBackward = false
        let blockBackwardDiagonal = false
        piece.movement.moves.forEach((i) => {
            //forward
            const columnNumber = getColumnNumber(position.column) + i.h 
            const row = piece.isBlack ? position.row + i.v : position.row - i.v
            if(columnNumber < 8 && columnNumber >= 0) {
                const column = getColumnLetter(columnNumber)
                if (row <= 8 && row > 0) {
                    const boardPosition = { column: column, row: row }
                    const pieceInPosition = getPieceFromPosition(boardPosition)
                    if (pieceInPosition == null) {
                        if (!blockForward) possibleMovements.push(boardPosition)
                    } else {
                        if (!blockForward) {
                            blockForward = true
                            if (pieceInPosition.isBlack !== piece.isBlack) {
                                killMovements.push(boardPosition)
                            }
                        }
                    }
                }
            }
            //consider diagonal
            if(i.h > 0 && i.v > 0) {
                const mirrorColumnNumber = columnNumber - (2 * i.h)
                if(mirrorColumnNumber < 8 && mirrorColumnNumber >= 0) {
                    const mirrorColumn = getColumnLetter(mirrorColumnNumber)
                    if(row <= 8 && row > 0) {
                        const boardPosition = {column: mirrorColumn, row: row}
                        const pieceInPosition = getPieceFromPosition(boardPosition)
                        if(pieceInPosition == null) {
                            if(!blockForwardDiagonal) possibleMovements.push(boardPosition) 
                        } else {
                            blockForwardDiagonal = true
                            if(!blockForwardDiagonal){
                                blockForwardDiagonal = true
                                if (pieceInPosition.isBlack !== piece.isBlack) {
                                    killMovements.push(boardPosition)
                                }
                            } 
                        }
                    }
                }
            }
            // backward movements
            if (!piece!.movement!.onlyForward) {
                const columnNumberNegative = getColumnNumber(position.column) - i.h 
                const rowNegative = position.row - i.v
                if(columnNumberNegative < 8 && columnNumberNegative >= 0) {
                    const columnNegative = getColumnLetter(columnNumberNegative)
                    if(rowNegative <= 8 && rowNegative > 0) {
                        const boardPosition = {column: columnNegative, row: rowNegative}
                        const pieceInPosition = getPieceFromPosition(boardPosition)
                        if(pieceInPosition == null) {
                            if(!blockBackward) possibleMovements.push(boardPosition)
                        } else {
                            blockBackward = true
                            if(!blockBackward){
                                blockBackward = true
                                if (pieceInPosition.isBlack !== piece.isBlack) {
                                    killMovements.push(boardPosition)
                                }
                            } 
                        }
                    }
                }
                //consider diagonal backward
                if(i.h > 0 && i.v > 0) {
                    const mirrorColumnNumber = columnNumberNegative + (2 * i.h)
                    if(mirrorColumnNumber < 8 && mirrorColumnNumber >= 0) {
                        const mirrorColumn = getColumnLetter(mirrorColumnNumber)
                        if(rowNegative <= 8 && rowNegative > 0) {
                            const boardPosition = {column: mirrorColumn, row: rowNegative} 
                            const pieceInPosition = getPieceFromPosition(boardPosition)
                            if(pieceInPosition == null) {
                                if(!blockBackwardDiagonal) possibleMovements.push(boardPosition)
                            } else {
                                blockBackwardDiagonal = true
                                if(!blockBackwardDiagonal){
                                    blockBackwardDiagonal = true
                                    if (pieceInPosition.isBlack !== piece.isBlack) {
                                        killMovements.push(boardPosition)
                                    }
                                } 
                            }
                        }
                    }
                }
            }
        })
        return possibleMovements
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
                newBoardValues.movements = moves
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
                newBoardValues.movements = moves
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

    function canKill() {

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
                //canKill={canKill()}
                //isBlocked= {isBlocked()}
                onSelected={(boardPosition: BoardPosition) => handleSelected(boardPosition)}
            />
        </div>
        )
    }
    
    const rowNumbers = [ 8, 7, 6, 5, 4, 3, 2, 1 ]

    return(
    <div>
        <div className="board">
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