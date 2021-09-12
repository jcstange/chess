import React from 'react'
import { Colors } from '../Constants/colors'
import '@fontsource/roboto'
import { Replay } from '@material-ui/icons'

type StatusProps = {
    isBlack: boolean
    status: Status,
    restart: ()=>void
}

export enum Status {
    TURN='Turn',
    CHECK='Check',
    CHECK_MATE='Check Mate',
    PAWN_SWITCH='Choose piece',
}

export const StatusTab : React.FC<StatusProps> = ({ isBlack, status, restart }) => {
    const styles = {
        status: {
            display: 'inline-flex',
            width: '97%',
            marginLeft: '4%',
            marginBottom: 5,
        },
        white: {
            width: '30%',
            textAlign: 'center' as 'center',
            alignSelf: 'center' as 'center',
            color: Colors.white,
            fontFamily: 'Roboto',
            backgroundColor: isBlack ? Colors.light_gray : Colors.selected_green,
            padding : 16,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            marginTop: 5,
            marginBottom: 5,
            marginRight: 0,
            marginLeft: 5,
            filter: `drop-shadow(2px 2px 2px ${Colors.shadow_gray})`,
        },
        black: {
            width: '30%',
            textAlign: 'center' as 'center',
            alignSelf: 'center' as 'center',
            color: Colors.white,
            fontFamily: 'Roboto',
            backgroundColor: isBlack ? Colors.selected_green : Colors.light_gray,
            padding : 16,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            marginTop: 5,
            marginBottom: 5,
            marginRight: 5,
            marginLeft: 0,
            filter: `drop-shadow(2px 2px 2px ${Colors.black})`,
        },
        check: {
            width: '30%',
            textAlign: 'center' as 'center',
            alignSelf: 'center' as 'center',
            color: Colors.white,
            fontFamily: 'Roboto',
            backgroundColor: status === Status.CHECK ? Colors.red : Colors.light_gray,
            padding : 16,
            borderRadius: 5,
            margin: 5,
            filter: `drop-shadow(2px 2px 2px ${Colors.shadow_gray})`,
        },
        resetButtom: {
            textAlign: 'center' as 'center',
            alignSelf: 'center' as 'center',
            width: '10%', 
            padding : 12,
            borderColor: isBlack ? Colors.white: Colors.black,
            borderRadius: 5,
            margin: 5,
            filter: `drop-shadow(2px 2px 2px ${Colors.shadow_gray})`,
            backgroundColor: Colors.move_blue
        }
    }
    return (<div style={styles.status}>
        <div style={styles.white}>
            White Turn
        </div>
        <div style={styles.black}>
            Black Turn
        </div>
        <div style={styles.check}>
            Check
        </div>
        <div style={styles.resetButtom}>
            <Replay style={{color: Colors.white, alignSelf: 'end'}} onClick={() => restart()}/>
        </div>   
    </div>)
}
