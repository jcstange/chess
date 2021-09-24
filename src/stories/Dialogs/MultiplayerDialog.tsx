import React from 'react'
import { CodeGenerator } from '../Components/CodeGenerator'
import { SelectButton } from '../Buttons/SelectButton'
import styled from 'styled-components'
import { Dialog } from '@material-ui/core'
import { Slide } from '@mui/material'

type MultiplayerDialogProps = {
    open: boolean
    buttonClick: () => void
} 

export const MultiplayerDialog : React.FC<MultiplayerDialogProps> = ({
    open,
    buttonClick
}) => {

    const MultiplayerDialog = styled(Dialog)`
        width: 100%; 
        overflow: none;
    `

    const MultiplayerDialogWrapper = styled.div`
        display:inline;
        border-radius: 32px;
        background-color: white;
        
    `

    const DialogContentWrapper = styled.div`
        display: flex-inline;
        width: auto;
        z-index: 1px;
        padding-top: 20px;
        margin-left: 20px; 
        margin-right: 20px; 
        margin-bottom: 20px; 

    `
    const Header = styled.div`
        font-size: 16px;
        font-family: "Roboto";
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: aliceblue;
    `

    const CodeInput = styled.input`
        padding: 16px;
        font-family: "Roboto";
        font-size: 20px;
    `
    const Separator = styled.div`
        width: 100%;
        height: 1px;
        background-color: black;
    `

    const Title = styled.div`
        padding:20px;
        text-align: center;
        font-family: "Roboto";
        font-size: 30px;
        font-variant: small-caps;

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
            <Separator />
            <DialogContentWrapper>
                <Header>Information on how to play multiplayer</Header>
                <CodeGenerator />
                <Header>If you wanna join a game type the game code</Header>
                <CodeInput type="text"></CodeInput>
                <SelectButton onClick={()=>{
                    buttonClick()
                }}>START</SelectButton>
            </DialogContentWrapper>    
        </MultiplayerDialogWrapper>
    </MultiplayerDialog>)
}