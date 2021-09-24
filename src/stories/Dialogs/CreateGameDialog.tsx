import React from 'react'
import { CodeGenerator } from '../Components/CodeGenerator'
import { SelectButton } from '../Buttons/SelectButton'
import styled from 'styled-components'
import { Dialog } from '@material-ui/core'
import { Slide } from '@mui/material'
import { Colors } from '../../Constants/colors'

type CreateGameDialogProps = {
    open: boolean
    buttonClick: () => void
    backClick: () => void
} 

export const CreateGameDialog : React.FC<CreateGameDialogProps> = ({
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
        z-index: 1px;
        padding-top: 20px;
        margin-left: 20px; 
        margin-right: 20px; 
        margin-bottom: 20px;
        text-align: center;
        justify-content: center;
        align-items: center;

    `
    const Header = styled.div`
        font-size: 25px;
        font-family: "Roboto";
        font-weight: bold;
        padding-top: 20px;
        padding-bottom: 20px;
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
                <Header>To play this game with a friend you must send this following code to your friend</Header>
                <CodeGenerator />
            </DialogContentWrapper>    
        </MultiplayerDialogWrapper>
        <SelectButton onClick={()=>{
            buttonClick()
        }}>START</SelectButton>
        <SelectButton onClick={()=>{
            backClick()
        }}>BACK</SelectButton>
    </MultiplayerDialog>)
}