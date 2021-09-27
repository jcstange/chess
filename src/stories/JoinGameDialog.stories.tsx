import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"

import { JoinGameDialog } from "./Dialogs/JoinGameDialog"

export default {
    title: "Dialogs/JoinGameDialog",
    component: JoinGameDialog,
    args: {
        open: true,
    },
} as ComponentMeta<typeof JoinGameDialog>

const Template: ComponentStory<typeof JoinGameDialog> = (args) => (
    <JoinGameDialog {...args} />
)
export const Primary = Template.bind({})
Primary.args = {}
