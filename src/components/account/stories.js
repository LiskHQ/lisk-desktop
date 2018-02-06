import React from 'react';
import { Provider } from 'react-redux';

import { storiesOf } from '@storybook/react';
import Account from './account';
import store from '../../store';

storiesOf('Account', module)
  .add('delegate', () => (
    <Provider store={store}>
      <Account
        peers={{
          status: {
            online: true,
          },
          data: {
            options: {
              name: 'testy',
            },
            currentPeer: 'testpeer',
            port: 8000,
          },
        }}
        account={{
          isDelegate: true,
          address: '9396639332432599292L',
          delegate: {
            username: 'testy',
          },
        }}
        balance="3.1415926535"
      />
    </Provider>
  ));
