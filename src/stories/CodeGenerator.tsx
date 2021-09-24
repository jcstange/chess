import React from 'react'
import styled from 'styled-components'
import { Colors } from '../Constants/colors'
import '@fontsource/roboto'

export const CodeGenerator : React.FC = () => {

    const CodeGeneratorField = styled.div`
        display: inline;
        padding-top: 16px;
        padding-bottom: 16px;
        padding-left: 26px;
        padding-right: 26px;
        border-style: solid;
        border-radius: 5px;
        border-width: 1px;
        border-color: black;
        margin-top: 20px;
        margin-bottom: 20px;
        font-family: "Roboto";
        font-weight: bold;
        background-color:${Colors.selected_green};
        color: ${Colors.shadow_gray};
        filter: drop-shadow(1px 1px 1px ${Colors.shadow_gray});
    `
    const random = Math.random().toString(16).substring(2,8)

    return (
        <CodeGeneratorField>
            {random}
        </CodeGeneratorField>
    )
}