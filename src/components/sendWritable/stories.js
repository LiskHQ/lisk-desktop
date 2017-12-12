import React from 'react';

import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';

import Send from './send';

import accounts from '../../../test/constants/accounts';
import store from '../../store';

const account = accounts.genesis;

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
