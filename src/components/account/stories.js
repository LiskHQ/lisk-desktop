import React from 'react';

import { storiesOf } from '@storybook/react';
import Account from './accountComponent';
import Address from './address';

storiesOf('Account', module)
  .add('delegate', () => (
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
        username: 'testy',
        address: '9396639332432599292L',
      }}
      balance="3.1415926535"
    />
  ));

storiesOf('Address', module)
  .add('delegate', () => (
    <Address
      isDelegate={true}
      username="testy"
      address="9396639332432599292L"
    />
  ))
  .add('non-delegate', () => (
    <Address
      isDelegate={false}
      address="9396639332432599292L"
    />
  ));
