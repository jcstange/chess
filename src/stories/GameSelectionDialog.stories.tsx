import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"

import { GameSelectionDialog } from "./Dialogs/GameSelectionDialog"

export default {
    title: "Dialogs/GameSelectionDialog",
    component: GameSelectionDialog,
    args: {
        open: true,
        textOne: "Single Player",
        textTwo: "Multi Player",
    },
} as ComponentMeta<typeof GameSelectionDialog>

const Template: ComponentStory<typeof GameSelectionDialog> = (args) => (
    <GameSelectionDialog {...args} />
)
export const Primary = Template.bind({})
Primary.args = {}
