
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CodeGenerator } from './CodeGenerator';

export default {
  title: 'CodeGenerator',
  component: CodeGenerator,
} as ComponentMeta<typeof CodeGenerator>;

const Template: ComponentStory<typeof CodeGenerator> = (args) => <CodeGenerator {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
