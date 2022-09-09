import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryWrapper from '../../../.storybook/components/StoryWrapper/StoryWrapper';
import Tooltip from './tooltip';

storiesOf('Toolbox', module).add('Tooltip', () => (
  <StoryWrapper>
    <h3>Normal state</h3>
    <Tooltip title="Tooltip title" position="right">
      <p>Tooltip content</p>
    </Tooltip>
    <h3>Simple tooltip</h3>
    <Tooltip alwaysShow position="right">
      <p>Tooltip content</p>
    </Tooltip>
    <h3>Expanded tooltip</h3>
    <Tooltip
      alwaysShow
      title="Tooltip title"
      position="right"
      content={<span>Something else than the icon</span>}
      footer={<a>Read more</a>}
    >
      <p>Tooltip content</p>
    </Tooltip>
  </StoryWrapper>
));
