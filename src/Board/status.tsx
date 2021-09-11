import React from 'react'
import { Colors } from '../Constants/colors'
import '@fontsource/roboto'
import { Replay } from '@material-ui/icons'

type StatusProps = {
    isBlack: boolean
    status: Status,
    restart: ()=>void
}

export const StatusTab : React.FC<StatusProps> = ({ isBlack, status, restart }) => {
    const styles = {
        status: {
            width: '92%',
            marginLeft: '5%',
            marginRight: '5%',
            marginBottom: 5,
            textAlign: 'center' as 'center',
            color: isBlack ? Colors.white : Colors.black,
            fontFamily: 'Roboto',
            backgroundColor: isBlack ? Colors.black : Colors.white,
            padding : 16,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: isBlack ? Colors.white: Colors.black,
            borderRadius: 5,
            filter: `drop-shadow(2px 2px 2px ${Colors.black})`,
        }
    }
    return (<div style={styles.status}>
        {status}
        <Replay style={{alignSelf: 'end'}} onClick={() => restart()}/>
    </div>)
}

export enum Status {
    TURN='Turn',
    CHECK='Check',
    CHECK_MATE='Check Mate',
    PAWN_SWITCH='Choose piece',
}