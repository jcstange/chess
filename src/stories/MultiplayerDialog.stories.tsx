
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { MultiplayerDialog } from './Dialogs/MultiplayerDialog';

export default {
  title: 'Dialogs/MultiplayerDialog',
  component: MultiplayerDialog,
  args: {
      open: true 
  },
} as ComponentMeta<typeof MultiplayerDialog>;

const Template: ComponentStory<typeof MultiplayerDialog> = (args) => <MultiplayerDialog {...args} />;
export const Primary = Template.bind({});
Primary.args ={}  