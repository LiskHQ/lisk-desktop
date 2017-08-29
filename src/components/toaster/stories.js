import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Toaster from './toaster';


storiesOf('Toaster', module)
  .add('default', () => (
    <Toaster
      toasts={[{
        label: 'Test toast',
        index: 0,
      }]}
      hideToast={ action('onHide') }
    />
  ))
  .add('success', () => (
    <Toaster
      toasts={[{
        label: 'Success toast',
        type: 'success',
        index: 0,
      }]}
      hideToast={ action('onHide') }
    />
  ))
  .add('error', () => (
    <Toaster
      toasts={[{
        label: 'Success toast',
        type: 'error',
        index: 0,
      }]}
      hideToast={ action('onHide') }
    />
  ));
