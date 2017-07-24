import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Dialog from './dialogElement';

const dialogContent = () => (<div>Hello</div>);

storiesOf('Dialog', module)
  .add('default', () => (
    <Dialog
      dialog={{
        title: 'Title',
        childComponent: dialogContent,
      }}
      onCancelClick={ action('onCancelClick') }
    />
  ));
