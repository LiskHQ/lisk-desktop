import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import StoryWrapper from '../../../../.storybook/components/StoryWrapper/StoryWrapper';
import { PrimaryButton, SecondaryButton } from './button';

storiesOf('Button', module)
  .add('Primary Button', () => (
    <StoryWrapper>
      <h2>Enabled State</h2>
      <PrimaryButton onClick={action('clicked')}>Get from GitHub</PrimaryButton>
      <h2>Disabled State</h2>
      <PrimaryButton disabled onClick={action('clicked')}>Get from GitHub</PrimaryButton>
    </StoryWrapper>
  ))
  .add('Secondary Button', () => (
    <StoryWrapper>
      <h2>Enabled State</h2>
      <SecondaryButton onClick={action('clicked')}>Get from GitHub</SecondaryButton>
      <h2>Disabled State</h2>
      <SecondaryButton disabled onClick={action('clicked')}>Get from GitHub</SecondaryButton>
    </StoryWrapper>
  ));
