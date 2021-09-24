import styled from 'styled-components'
import { Colors } from '../Constants/colors'

export const SelectButton = styled.div`
    padding: 20px;
    margin: 20px;
    color: ${Colors.white};
    background-color: ${Colors.move_blue};
    text-transform: uppercase;
    font-family: "Roboto";
    font-size: 3em;
    text-align: center;
    border-radius: 32px;
    filter: drop-shadow(2px 2px 4px ${Colors.shadow_gray});
    transition: 500ms linear;
    &:hover{
        background-color: ${Colors.shadow_gray};
        transition: 500ms linear;
    } `
