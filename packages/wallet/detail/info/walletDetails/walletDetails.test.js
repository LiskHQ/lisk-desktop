import React from 'react';
import { mount } from 'enzyme';
import WalletDetails from '@token/fungible/components/WalletDetails/WalletDetails';

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
      },
    },
    settings: {
      token: {
        active: 'LSK',
        list: {
          LSK: true,
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
