import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Dialog from './dialog';
import Alert from './alert';

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
  ))
  .add('Success alert', () => (
    <Dialog
      dialog={{
        title: 'Success',
        type: 'success',
        childComponent: Alert,
        childComponentProps: {
          text: 'Custom success message',
        },
      }}
      onCancelClick={ action('onCancelClick') }
    />
  ))
  .add('Error alert', () => (
    <Dialog
      dialog={{
        title: 'Error',
        type: 'error',
        childComponent: Alert,
        childComponentProps: {
          text: 'Custom error message',
        },
      }}
      onCancelClick={ action('onCancelClick') }
    />
  ));
