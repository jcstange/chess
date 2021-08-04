
import React from 'react'
import { Piece } from '../Pieces/pieces'
import { Nullable, BoardPosition } from './board'
import { Square } from './square'

type BoardRowProps = {
    rowNumber: number,
    pieces: Nullable<Piece>[],
    selected: Nullable<BoardPosition>
    canMove: Nullable<BoardPosition>[] | null
    canKill: Nullable<BoardPosition>[] | null
    check: Nullable<[BoardPosition, BoardPosition]>
    onSelected: (boardPosition: BoardPosition) => void
}

export const BoardRow: React.FC<BoardRowProps> = ({ 
    rowNumber, 
    pieces, 
    selected, 
    canMove, 
    canKill, 
    check, 
    onSelected
}) => {

    const styles = {
        boardRow: {
            display: 'flex',
            width:'100%',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }

    function handleSelected(position: BoardPosition) {
        onSelected(position)
    }
    
    function canMoveToSquare(
        position: Nullable<BoardPosition>, 
        positions: Nullable<BoardPosition>[] | null
    ) : boolean {
        if (positions === null) return false
        if (positions.length === 0) return false
        if (position === null) return false
        for(let i = 0; i<positions.length; i++) {
            if (positions[i] === null) return false
            if (positions[i]!.column === null) return false
            if (positions[i]!.row === null) return false
            if (positions[i]!.column! === position!.column! 
                && positions[i]!.row! === position!.row!) {
                return true
            }
        }
        return false
    }

    function comparePositions(
        positionA: Nullable<BoardPosition>, 
        positionB: Nullable<BoardPosition>
    ) {
        return positionA !== null && positionB !== null
            && positionA.column === positionB.column 
            && positionA.row === positionB.row
    }

    function renderSquare(column: string) {
        const columns = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]
        
        let columnNumber: number | null = columns.findIndex((i) => i === column)

        if (columnNumber == null) return

        const position = {column: column, row: rowNumber} as BoardPosition

        return (
        <Square 
            position={position}  
            piece={pieces ? pieces[columnNumber] : null}
            canMove= {canMoveToSquare(position, canMove)}
            canKill= {canMoveToSquare(position, canKill)}
            selected= {comparePositions(position, selected)}
            inCheck= {comparePositions(position, check ? check[1] : null)}
            onSelected={(position: BoardPosition) =>  handleSelected(position)}
           />
        )
    }

    return (
    <div className="boardRow" style={styles.boardRow}>
        {renderSquare('A')}
        {renderSquare('B')}
        {renderSquare('C')}
        {renderSquare('D')}
        {renderSquare('E')}
        {renderSquare('F')}
        {renderSquare('G')}
        {renderSquare('H')}
    </div>
    )
}