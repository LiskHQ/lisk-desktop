import React from 'react';
import { Provider } from 'react-redux';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import SignMessage from './signMessage';
import store from '../../store';

const publicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
const account = {
  passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
  publicKey,
};

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
