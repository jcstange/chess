import { ComponentStory, ComponentMeta } from "@storybook/react"

import { TurnBarWhite } from "./Components/TurnBar"

export default {
    title: "Components/Turn Bar",
    component: TurnBarWhite,
    args: {
        blackTurn: false,
    },
} as ComponentMeta<typeof TurnBarWhite>

const Template: ComponentStory<typeof TurnBarWhite> = (args) => (
    <TurnBarWhite {...args} />
)

export const Primary = Template.bind({})
Primary.args = {}
