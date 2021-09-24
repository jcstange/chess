import React from "react"
import styled from "styled-components"
import { Colors } from "../Constants/colors"
import { Piece } from "../Pieces/pieces"

type CemeteryProps = {
    cemetery: Piece[]
}

export const Cemetery: React.FC<CemeteryProps> = ({ cemetery }) => {
    const CemeteryWrapper = styled.div`
       padding: 20px; 
    `
    const FlexContainer = styled.div`
       display: flex; 
    `
    function makeList() {
        return cemetery.map((i) => {
            if(i===null) return <div></div>
            var image = require("../stories/assets/" + i.image)
            return (
                <div
                    style={{
                        backgroundColor: i?.isBlack
                            ? Colors.white
                            : Colors.black,
                    }}
                >
                    <img
                        style={{
                            display: "block",
                            width: "50%",
                            padding: 20,
                            filter: i?.isBlack ? "none" : "invert(100%)",
                        }}
                        src={image.default}
                        alt=""
                    />
                </div>
            )
        })
    }
    return <CemeteryWrapper>
            <FlexContainer>{makeList()}</FlexContainer>
        </CemeteryWrapper>
}
