import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Toaster from './toasterComponent';


storiesOf('Toaster', module)
  .add('default', () => (
    <Toaster
      label='Test toast'
      hideToast={ action('onHide') }
    />
  ))
  .add('success', () => (
    <Toaster
      label='Success toast'
      type='success'
      hideToast={ action('onHide') }
    />
  ))
  .add('error', () => (
    <Toaster
      label='Error toast'
      type='error'
      hideToast={ action('onHide') }
    />
  ));
