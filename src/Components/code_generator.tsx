import styled from 'styled-components'
import React from 'react'

export const CodeGenerator : React.FC = () => {

    const CodeGeneratorField = styled.div`
        padding: 20px;
        border-style: solid;
        border-radius: 5px;
        border-width: 1px;
        border-color: black;
    `
    const random = Math.random().toString(16).substring(2,6)

    return (
        <CodeGeneratorField>
            {random}
        </CodeGeneratorField>
    )
}