import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SelectButton } from './Buttons/SelectButton';

export default {
  title: 'Buttons/Select Button',
  component: SelectButton,
  args: {}
} as ComponentMeta<typeof SelectButton>;

const Template: ComponentStory<typeof SelectButton> = (args) => <SelectButton {...args}>Button</SelectButton>;

export const Primary = Template.bind({});
Primary.args = {};