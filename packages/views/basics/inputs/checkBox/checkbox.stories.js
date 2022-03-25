import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import StoryWrapper from '../../../../../.storybook/components/StoryWrapper/StoryWrapper';
import CheckBox from './index';

storiesOf('Toolbox', module)
  .add('Checkbox', () => (
    <StoryWrapper>
      <h3>Checked</h3>
      <CheckBox checked onChange={action('clicked')} />
      <h3>Unchecked</h3>
      <CheckBox onChange={action('clicked')} />
      <h3>Accent</h3>
      <CheckBox checked accent onChange={action('clicked')} />
      <h3>Removed</h3>
      <CheckBox removed onChange={action('clicked')} />
    </StoryWrapper>
  ));
