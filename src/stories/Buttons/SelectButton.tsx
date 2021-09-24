import styled from 'styled-components'
import { Colors } from '../../Constants/colors'

export const SelectButton = styled.div`
    display: flex;
    padding: 20px;
    margin: 20px;
    color: ${Colors.white};
    background-color: ${Colors.move_blue};
    text-transform: uppercase;
    font-family: "Roboto";
    font-size: 3em;
    text-align: center;
    justify-content: center;
    border-radius: 50px;
    filter: drop-shadow(2px 2px 4px ${Colors.shadow_gray});
    transition: 500ms linear;
    &:hover{
        background-color: ${Colors.shadow_gray};
        transition: 500ms linear;
    }
    &:active{
        background-color: ${Colors.selected_green};
        transition: 200ms linear;
    } `

type ImageButtomProps = {
    src: string
    text: string
}

export const ImageButton: React.FC<ImageButtomProps> = ({src, text}) => {
    const getImage = () => {
        var image = require("../assets/" + src)
        return (<img src={image.default} alt={""}/>)

    }
    return(
        <SelectButton>
            {getImage}
            {text}
        </SelectButton>
    )
}
