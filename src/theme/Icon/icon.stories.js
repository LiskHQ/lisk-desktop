import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryWrapper from '../../../.storybook/components/StoryWrapper/StoryWrapper';
import Icon, { icons } from './index';

storiesOf('Toolbox', module)
  .add('Icon', () => (
    <StoryWrapper>
      <h3>Icons</h3>
      { Object.keys(icons).map(icon => (<Icon name={icon} key={icon} />))}
    </StoryWrapper>
  ));
