import React from 'react'
import { SelectButton } from '../Buttons/SelectButton'
import styled from 'styled-components'
import { Dialog } from '@material-ui/core'
import { Slide } from '@mui/material'
import { Colors } from '../../Constants/colors'

type JoinGameDialogProps = {
    open: boolean
    buttonClick: () => void
    backClick: () => void
} 

export const JoinGameDialog : React.FC<JoinGameDialogProps> = ({
    open,
    buttonClick,
    backClick
}) => {

    const MultiplayerDialog = styled(Dialog)`
        width: 100%; 
        overflow: none;
    `

    const MultiplayerDialogWrapper = styled.div`
        display:inline;
    `

    const DialogContentWrapper = styled.div`
        display: block;
        width: auto;
        text-align: center;
        z-index: 1px;
        padding-top: 20px;
        margin-left: 20px; 
        margin-right: 20px; 
        margin-bottom: 20px; 

    `
    const Header = styled.div`
        font-size: 25px;
        font-family: "Roboto";
        padding-top: 20px;
        padding-bottom: 20px;
        text-align: center;
        color: white;
        filter: drop-shadow(2px 2px 2px ${Colors.shadow_gray});
    `

    const CodeInput = styled.input`
        padding: 16px;
        font-family: "Roboto";
        font-size: 35px;
        border-radius: 5px;
        border-color: white;
        background-color: transparent;
        color: white;
        filter: drop-shadow(2px 2px 2px ${Colors.shadow_gray});
    `
    const Title = styled.div`
        padding:20px;
        text-align: center;
        font-family: "Roboto";
        font-size: 45px;
        font-variant: small-caps;
        color: white;
        filter: drop-shadow(2px 2px 2px ${Colors.shadow_gray});

    `
    return (
    <MultiplayerDialog
        open={open}
        TransitionComponent={Slide}
        transitionDuration={2000}
        PaperProps={{
            style: {
                backgroundColor: "transparent",
                boxShadow: "none",
                overflow: "none",
                width: "100%"
            }
        }}
    >
        <MultiplayerDialogWrapper>
            <Title>Multiplayer Game</Title>
            <DialogContentWrapper>
                <Header>To join a game, type your friend's code here</Header>
                <CodeInput type="text"></CodeInput>
            </DialogContentWrapper>    
        </MultiplayerDialogWrapper>
        <SelectButton onClick={()=>{
            buttonClick()
        }}>JOIN</SelectButton>
        <SelectButton onClick={()=>{
            backClick()
        }}>BACK</SelectButton>
    </MultiplayerDialog>)
}