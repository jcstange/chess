
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TurnBarWhite } from './TurnBar';

export default {
  title: 'Turn Bar',
  component: TurnBarWhite,
  args: {
      blackTurn: false
  }
} as ComponentMeta<typeof TurnBarWhite>;

const Template: ComponentStory<typeof TurnBarWhite> = (args) => <TurnBarWhite {...args} />;

export const Primary = Template.bind({});
Primary.args = {};