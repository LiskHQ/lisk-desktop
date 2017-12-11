import React from 'react';
import { Provider } from 'react-redux';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import accounts from '../../../test/constants/accounts';
import SignMessage from './signMessage';
import store from '../../store';

const account = accounts.genesis;

storiesOf('SignMessage', module)
  .addDecorator(getStory => (
    <Provider store={store}>
      {getStory()}
    </Provider>
  ))
  .add('default', () => (
    <SignMessage
      account={account}
      closeDialog={action('closeDialog')}
      successToast={action('succesToast')}
    />
  ));
