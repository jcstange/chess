import styled from 'styled-components'
import { Colors } from '../Constants/colors'

const TurnBar = styled.div`
    width: 100%;
    height: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 5px;
    filter: drop-shadow(2px 2px 4px ${Colors.shadow_gray});
    background-color: yellow;
    transition: opacity 3s;
`

export const TurnBarWhite = styled(TurnBar)<{ blackTurn: boolean}>`
    opacity: ${p => p.blackTurn ? 0 : 1};
`
export const TurnBarBlack = styled(TurnBar)<{ blackTurn: boolean}>`
    opacity: ${p => p.blackTurn ? 1 : 0};
`