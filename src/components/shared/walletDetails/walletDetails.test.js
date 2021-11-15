import React from 'react';
import { mount } from 'enzyme';
import WalletDetails from './walletDetails';

describe('WalletDetails', () => {
  let wrapper;

  const props = {
    account: {
      info: {
        LSK: {
          balance: '100',
          token: 'LSK',
        },
        BTC: {
          balance: '20',
          token: 'BTC',
        },
      },
    },
    settings: {
      token: {
        active: 'LSK',
        list: {
          LSK: true,
          BTC: false,
        },
      },
    },
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<WalletDetails {...props} />);
  });

  it('Should render properly', () => {
    expect(wrapper).toContainMatchingElement('.coin-container');
    expect(wrapper).toContainMatchingElements(2, 'section.coin-row');
  });
});
