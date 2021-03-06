import React from "react"
import { Piece } from "../Pieces/pieces"
import { Colors } from "../Constants/colors"
import lightTexture from "../stories/assets/lightTexture.jpeg"
import darkTexture from "../stories/assets/darkTexture.jpeg"

type SquareProps = {
    position: BoardPosition
    piece: Nullable<Piece>
    canMove: boolean
    canKill: boolean
    selected: boolean
    inCheck: boolean
    onSelected: (boardPosition: BoardPosition) => void
}

export const Square: React.FC<SquareProps> = ({
    position,
    piece,
    canMove,
    canKill,
    selected,
    inCheck,
    onSelected,
}) => {
    const columns = ["A", "B", "C", "D", "E", "F", "G", "H"]

    /*
     * Check if column starts with black square
     */
    function firstBlack(): boolean {
        const index = columns.findIndex((i) => i === position.column)
        if (index % 2) return true
        else return false
    }

    /*
     * Check is this square is a black square
     */
    function isBlack(): boolean {
        if (firstBlack()) {
            if (position.row % 2) return false
            else return true
        } else {
            if (position.row % 2) return true
            else return false
        }
    }

    function selectPiece() {
        onSelected(position)
    }

    function getImage(src: string | null | undefined) {
        if (src === null || src === undefined)
            return <div className="emptySquare"></div>
        if (src.length > 2) {
            var image = require("../stories/assets/" + src)
            return (
                <img
                    style={{
                        display: "block",
                        width: "50%",
                        marginLeft: "25%",
                        filter: piece?.isBlack ? "none" : "invert(100%)",
                    }}
                    src={image.default}
                    alt=""
                    className="pieceImage"
                />
            )
        } else {
            return src
        }
    }

    const styles = {
        square: {
            width: "10vw",
            height: "10vw",
            maxWidth: 100,
            maxHeight: 100,
            backgroundImage: selected
                ? "none"
                : inCheck
                ? "none"
                : canMove
                ? "none"
                : canKill
                ? "none"
                : isBlack()
                ? `url(${darkTexture})`
                : `url(${lightTexture})`,
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            backgroundColor: selected
                ? Colors.selected_green
                : inCheck
                ? Colors.red
                : canMove
                ? Colors.move_blue
                : canKill
                ? Colors.red
                : isBlack()
                ? Colors.brown
                : Colors.light_brown,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: Colors.white,
        },
    }
    return (
        <div
            className="square"
            style={styles.square}
            onClick={() => selectPiece()}
        >
            <div
                style={{
                    position: "relative",
                    top: "50%",
                    left: "50%",
                    margin: 0,
                    zIndex: 1,
                    filter: `drop-shadow(4px 4px 4px ${Colors.shadow_gray})`,
                    transform: "translate(-50%,-50%)",
                }}
            >
                {getImage(piece?.image)}
            </div>
        </div>
    )
}
