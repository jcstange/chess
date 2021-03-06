import React from "react"
import styled from "styled-components"
import { Dialog } from "@material-ui/core"
import { SelectButton } from "../Buttons/SelectButton"
import { Slide } from "@mui/material"

type GameSelectionDialogProps = {
    open: boolean
    textOne: string
    textTwo: string
    clickOne: () => void
    clickTwo: () => void
}

export const GameSelectionDialog: React.FC<GameSelectionDialogProps> = ({
    open,
    textOne,
    textTwo,
    clickOne,
    clickTwo,
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
                },
            }}
        >
            <InlineWrapper>
                <SelectButton
                    onClick={() => {
                        clickOne()
                    }}
                >
                    {textOne}
                </SelectButton>
                <SelectButton
                    onClick={() => {
                        clickTwo()
                    }}
                >
                    {textTwo}
                </SelectButton>
            </InlineWrapper>
        </GameSelectionDialog>
    )
}
