import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import StoryWrapper from '../components/StoryWrapper/StoryWrapper';
import { PrimaryButtonV2, SecondaryButtonV2, DangerButtonV2 } from 'Components/toolbox/buttons/button';

storiesOf('Button', module)
  .add('Primary Button', () => (
    <StoryWrapper>
      <h2>Enabled State</h2>
      <PrimaryButtonV2 onClick={action('clicked')}>Get from GitHub</PrimaryButtonV2>
      <h2>Disabled State</h2>
      <PrimaryButtonV2 disabled onClick={action('clicked')}>Get from GitHub</PrimaryButtonV2>
    </StoryWrapper>
  ))
  .add('Secondary Button', () =>
    <StoryWrapper>
      <h2>Enabled State</h2>
      <SecondaryButtonV2 onClick={action('clicked')}>Get from GitHub</SecondaryButtonV2>
      <h2>Disabled State</h2>
      <SecondaryButtonV2 disabled onClick={action('clicked')}>Get from GitHub</SecondaryButtonV2>
    </StoryWrapper>
  )
  .add('Danger Button', () =>
    <StoryWrapper>
      <h2>Enabled State</h2>
      <DangerButtonV2 onClick={action('clicked')}>Get from GitHub</DangerButtonV2>
      <h2>Disabled State</h2>
      <DangerButtonV2 disabled onClick={action('clicked')}>Get from GitHub</DangerButtonV2>
    </StoryWrapper>
  );
