import React from 'react';

import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';

import Send from './send';

import store from '../../store';

const account = {
  passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
  address: '16313739661670634666L',
  balance: 1000e8,
};

storiesOf('Send', module)
  .addDecorator(getStory => (
    <Provider store={store}>
      {getStory()}
    </Provider>
  ))
  .add('pre-filled recipient and amount', () => (
    <Send recipient='11004588490103196952L' amount='100' account={account} activePeer={{}} />
  ))
  .add('without pre-filles', () => (
    <Send account={account} activePeer={{}} />
  ));
