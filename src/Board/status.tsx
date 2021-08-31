import React from 'react'
import { Colors } from '../Constants/colors'

type StatusProps = {
    isBlack: boolean
    status: Status 
}

export const StatusTab : React.FC<StatusProps> = ({ isBlack, status }) => {
    const styles = {
        status: {
            textAlign: 'center' as 'center',
            color: isBlack ? Colors.white : Colors.black,
            backgroundColor: isBlack ? Colors.black : Colors.white,
            padding : 16,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: isBlack ? Colors.white: Colors.black,
            borderRadius: 5,
        }
    }
    return (<div style={styles.status}>
        {status}
    </div>)
}

export enum Status {
    TURN='Turn',
    CHECK='Check',
    CHECK_MATE='Check Mate',
    PAWN_SWITCH='Choose piece',
}