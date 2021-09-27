import React from "react"
import styled from "styled-components"
import { Colors } from "../../Constants/colors"
import "@fontsource/roboto"

export const CodeGenerator: React.FC = () => {
    const CodeGeneratorField = styled.div`
        display: inline-block;
        padding-top: 16px;
        padding-bottom: 16px;
        padding-left: 26px;
        padding-right: 26px;
        border-style: solid;
        border-radius: 5px;
        border-width: 5px;
        margin-top: 20px;
        margin-bottom: 20px;
        font-family: "Roboto";
        font-weight: bold;
        font-size: 30px;
        text-align: center;
        color: ${Colors.white};
        filter: drop-shadow(2px 2px 2px ${Colors.shadow_gray});
    `
    const random = Math.random().toString(16).substring(2, 8)

    return <CodeGeneratorField>{random}</CodeGeneratorField>
}
