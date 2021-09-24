import React from 'react'
import styled from 'styled-components'
import { Dialog } from '@material-ui/core'
import { SelectButton } from '../Buttons/SelectButton'
import { Slide } from '@mui/material'

type GameSelectionDialogProps = {
    open: boolean
    singlePlayerClick: () => void
    multiPlayerClick: () => void
}

export const GameSelectionDialog: React.FC<GameSelectionDialogProps> = ({
    open,
    singlePlayerClick,
    multiPlayerClick
}) => {
    const GameSelectionDialog = styled(Dialog)`
        display: inline;
        transition: fade 1000ms linear;
    `
    const InlineWrapper = styled.div`
        display: inline;
        padding: 20px;

    `
    return (
    <GameSelectionDialog 
        open={open}
        TransitionComponent={Slide}
        transitionDuration={2000}
        PaperProps={{
            style: {
                backgroundColor: "transparent",
                boxShadow: "none",
                overflow: "none",
                width: "100%",
            }
        }}
        >
        <InlineWrapper>
            <SelectButton onClick={() => {
                singlePlayerClick()
            }}>
                Single Player
            </SelectButton>
            <SelectButton onClick={()=>{
                multiPlayerClick()
            }}>
                Multiplayer
            </SelectButton>
        </InlineWrapper>    
    </GameSelectionDialog>
    )
}