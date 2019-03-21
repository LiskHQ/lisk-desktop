import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { PrimaryButtonV2, SecondaryButtonV2 } from 'Components/toolbox/buttons/button';

storiesOf('Button', module)
  .add('with text', () => <PrimaryButtonV2 onClick={action('clicked')}>Hello Button</PrimaryButtonV2>)
  .add('with some emoji', () => (
    <SecondaryButtonV2 onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        Heyy yooo
      </span>
    </SecondaryButtonV2>
  ));
