import React, { useState } from "react"
import { Dialog, Button } from "@mui/material"
import { PawnSwitch } from "./pawnSwitch"
import { Piece } from "../../Pieces/pieces"

type PawnSwitchDialogProps = {
    open: IPawnSwitch
    handleClose: (piece: Piece, position: BoardPosition) => void
}

export const PawnSwitchDialog: React.FC<PawnSwitchDialogProps> = ({
    open,
    handleClose,
}) => {
    const [selected, setSelected] = useState<Nullable<Piece>>(null)
    return (
        <Dialog open={open.open}>
            <PawnSwitch
                isBlack={open.isBlack!}
                selected={(piece) => setSelected(piece)}
            />
            <Button
                disabled={selected === null}
                onClick={() => handleClose(selected!, open.position!)}
            >
                Ok
            </Button>
        </Dialog>
    )
}
