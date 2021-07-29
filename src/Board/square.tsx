
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
            width: '50vw',
            height: '10vw',
            backgroundColor: selected ? Colors.selected_green : canMove ? Colors.move_blue : canKill ? Colors.red : isBlack() ? Colors.brown : Colors.light_brown,
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
          <div style={{ 
              position: 'relative',
              top: '50%',
              left: '50%',
              margin: 0,
              textAlign: 'center',
              color: piece !== null ? piece.isBlack ? Colors.black : Colors.white : Colors.black,
              fontSize: 30, 
              transform: 'translate(-50%,-50%)'
            }}>
                {piece?.image ?? ""}
          </div>
    </div>
    )
}
