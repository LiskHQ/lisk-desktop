import React from 'react';

import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';

import Form from './form';

import accounts from '../../../../../test/constants/accounts';
import store from '../../../../store';

const account = accounts.genesis;

storiesOf('Form', module)
  .addDecorator(getStory => (
    <Provider store={store}>
      {getStory()}
    </Provider>
  ))
  .add('pre-filled recipient and amount', () => (
    <Form recipient='11004588490103196952L' amount='100' account={account} liskAPIClient={{}} />
  ))
  .add('without pre-filles', () => (
    <Form account={account} liskAPIClient={{}} />
  ));
