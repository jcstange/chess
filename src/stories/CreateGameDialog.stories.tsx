import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"

import { CreateGameDialog } from "./Dialogs/CreateGameDialog"

export default {
    title: "Dialogs/CreateGameDialog",
    component: CreateGameDialog,
    args: {
        open: true,
    },
} as ComponentMeta<typeof CreateGameDialog>

const Template: ComponentStory<typeof CreateGameDialog> = (args) => (
    <CreateGameDialog {...args} />
)
export const Primary = Template.bind({})
Primary.args = {}
