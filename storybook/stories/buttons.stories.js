import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { PrimaryButtonV2, SecondaryButtonV2, DangerButtonV2 } from 'Components/toolbox/buttons/button';

storiesOf('Button', module)
  .add('Primary Button', () => (
    <React.Fragment>
      <h2>Enabled State</h2>
      <PrimaryButtonV2 onClick={action('clicked')}>Get from GitHub</PrimaryButtonV2>
      <h2>Disabled State</h2>
      <PrimaryButtonV2 disabled onClick={action('clicked')}>Get from GitHub</PrimaryButtonV2>
    </React.Fragment>
  ))
  .add('Secondary Button', () =>
    <React.Fragment>
      <h2>Enabled State</h2>
      <SecondaryButtonV2 onClick={action('clicked')}>Get from GitHub</SecondaryButtonV2>
      <h2>Disabled State</h2>
      <SecondaryButtonV2 disabled onClick={action('clicked')}>Get from GitHub</SecondaryButtonV2>
    </React.Fragment>
  )
  .add('Danger Button', () =>
    <React.Fragment>
      <h2>Enabled State</h2>
      <DangerButtonV2 onClick={action('clicked')}>Get from GitHub</DangerButtonV2>
      <h2>Disabled State</h2>
      <DangerButtonV2 disabled onClick={action('clicked')}>Get from GitHub</DangerButtonV2>
    </React.Fragment>
  );
