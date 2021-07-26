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

    function getColumnNumber(column: string) {
        const columns = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]
        for(let i=0; i<columns.length; i++) {
            if(column === columns[i]) {
                return  i
            }
        }
        throw("") 
    }
    function getColumnLetter(column: number)  {
        const columns = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]
        return columns[column]
    }

    function getMovesForPiece(piece: Nullable<Piece>, position: BoardPosition) : Nullable<BoardPosition>[]{
        if(piece === null) return []
        if(piece.movement === null) return []
        let possibleMovements : Nullable<BoardPosition>[] = []
        for(let i=0; i<piece.movement.moves.length ?? 0; i++) {
            const move = piece.movement.moves[i]
            const columnNumber = getColumnNumber(position.column) + move.h 
            const row = piece.isBlack ? position.row + move.v : position.row - move.v
            if(columnNumber < 8 || columnNumber >= 0) {
                const column = getColumnLetter(columnNumber)
                if(columnNumber < 8 || columnNumber >= 0) {
                    possibleMovements.push({column:  column, row: row})
                }
            }
            //consider diagonal
            if(move.h > 0 && move.v > 0) {
                const mirrorColumnNumber = columnNumber - (2 * move.h)
                if(mirrorColumnNumber < 8 || mirrorColumnNumber >= 0) {
                    const mirrorColumn = getColumnLetter(mirrorColumnNumber)
                    possibleMovements.push({column: mirrorColumn, row: row}) 
                }
            }
        }
        for(let i=0; i<piece.movement.moves.length; i++) {
            // Negative movements
            if (piece.movement.onlyForward) break
            const move = piece.movement.moves[i]
            const columnNumberNegative = getColumnNumber(position.column) - move.h 
            const rowNegative = position.row - move.v
            if(columnNumberNegative < 8 || columnNumberNegative >= 0) {
                const columnNegative = getColumnLetter(columnNumberNegative)
                if(rowNegative < 8 || rowNegative >= 0) {
                    possibleMovements.push({column:  columnNegative, row: rowNegative})
                }
            }
            //consider diagonal
            if(move.h > 0 && move.v > 0) {
                const mirrorColumnNumber = columnNumberNegative + (2 * move.h)
                if(mirrorColumnNumber < 8 || mirrorColumnNumber >= 0) {
                    const mirrorColumn = getColumnLetter(mirrorColumnNumber)
                    possibleMovements.push({column: mirrorColumn, row: rowNegative}) 
                }
            }
        }
        return possibleMovements
    }

    function removeImpossibleMoves(piece: Nullable<Piece>, position: BoardPosition, moves: BoardPosition[]) : Nullable<BoardPosition>[] {
        //forward
        const movesToRemove : number[] = moves.map((i: Nullable<BoardPosition>) => {
            if(getPieceFromPosition(i) !== null) {
                return moves.indexOf(i)
            }
        }).filter((i) => typeof i === 'number')
        movesToRemove.forEach((i) => moves[i] = null) 

        const newMoves : BoardPosition[] = moves.filter((i) => i != null)
        return newMoves
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
                const newMoves = removeImpossibleMoves(piece,position,moves)
                newBoardValues.movements = newMoves
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
        if(position === null) return null
        const newBoard = boardValues.board
        return newBoard[position.row - 1][getColumnNumber(position.column)]
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
            <button style={styles.button}>RESET</button>
        </div>
    </div>
    )
}