import React from 'react';
import { mount } from 'enzyme';
import WalletDetails from '../../holdings/walletDetails/walletDetails';

describe('WalletDetails', () => {
  let wrapper;

  const props = {
    location: { search: '' },
    wallet: {
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
    wrapper = mount(<WalletDetails {...props} />);

    expect(wrapper).toContainMatchingElement('.coin-container');
    expect(wrapper).toContainMatchingElements(1, 'section.coin-row');
  });
});
