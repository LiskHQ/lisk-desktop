import React from 'react';
import { Provider } from 'react-redux';

import { storiesOf } from '@storybook/react';
import Account from './account';
import Address from './address';
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

storiesOf('Address', module)
  .add('delegate', () => (
    <Address
      isDelegate={true}
      delegate= {{ username: 'testy' }}
      address="9396639332432599292L"
    />
  ))
  .add('non-delegate', () => (
    <Address
      isDelegate={false}
      address="9396639332432599292L"
    />
  ));
