
import React, { useEffect, useState} from 'react'
import { Piece } from '../Pieces/pieces'
import { Colors } from '../Constants/colors'
import { Nullable, BoardPosition }from './board'

type SquareProps = {
    position:  BoardPosition,
    piece: Nullable<Piece>,
    canMove: boolean,
    canKill: boolean,
    isBlocked: boolean,
    selected: boolean,
    onSelected: (boardPosition:BoardPosition) => void
}

export const Square: React.FC<SquareProps> = ({ position, piece, canMove, canKill, isBlocked, selected, onSelected }) => {
    const columns = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]

    const [ move , setMove ] = useState<boolean>(canMove)

    //useEffect(() => { if(canMove) alert(`canMove: ${position.column}${position.row}`)})

    function firstBlack(): boolean {
        for(let i = 0; i<columns.length; i++){
            if(position.column === columns[i]) {
                if(i % 2) return true 
                else return false
            } 
        }
        return true
    }
    function isBlack(): boolean {
        if(firstBlack()) {
            if(position.row % 2) return false
            else return true
        } else {
            if(position.row % 2) return true
            else return false
        }
    }

    function selectPiece() {
        onSelected(position)
    }

    const styles = {
        square: {
            display: 'flex',
            width: 80,
            height: 80,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: selected ? Colors.selected_green : canMove ? Colors.move_blue : isBlack() ? Colors.brown : Colors.light_brown,
            color: piece !== null ? piece.isBlack ? Colors.black : Colors.white : Colors.black,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: Colors.white
        }
    }
    return (
    <div 
      style={styles.square}
      onClick={() => selectPiece()}
      >
        {piece?.image ?? ""}
    </div>
    )
}
