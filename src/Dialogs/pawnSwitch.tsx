import React, { useState } from 'react'
import { Piece, Rook, Knight, Bishop, Queen } from '../Pieces/pieces'
import { Colors } from '../Constants/colors'

type PawnSwitchProps = {
    isBlack: boolean 
    selected: (piece: Piece) => void 
}
export const PawnSwitch : React.FC<PawnSwitchProps> = ({ isBlack, selected}) => {

    const styles = {
        pawnSwitch: {
            display: 'flex'
        },
        item: {
            padding: 20
        },
        image: {
            filter: isBlack ? 'none' : 'invert(100%)',
            width: '10vw',
            height: '10vw',
        }
    }

    const [ selectedPiece, setSelectedPiece ] = useState<Nullable<Piece>>(null)

    function selectPiece(i: Piece) {
        console.log(`selected: ${i.image}`)
        setSelectedPiece(i)
        selected(i)
    }

    function renderPieces() {
        let pieces : Piece[] = [ new Rook(isBlack), new Knight(isBlack),new Bishop(isBlack), new Queen(isBlack) ]
        return pieces.map((i) => {
            var image = require('../Images/' + i.image)
            return <div onClick={()=> selectPiece(i)} style={{...styles.item, backgroundColor: selectedPiece?.image === i.image ? Colors.selected_green : isBlack ? Colors.white : Colors.black }}>
                <img style={styles.image}src={image.default} alt=""/>
            </div>
        })
    }

    return <div style={styles.pawnSwitch}>
        {renderPieces()}
    </div>
}