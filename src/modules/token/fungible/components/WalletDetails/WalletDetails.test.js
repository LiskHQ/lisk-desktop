import React from 'react';
import { mount } from 'enzyme';
import WalletDetails from './WalletDetails';

describe('WalletDetails', () => {
  let wrapper;

  const props = {
    wallet: {
      info: {
        LSK: {
          balance: '100',
          token: 'LSK',
        },
      },
    },
    token: {
      active: 'LSK',
      list: {
        LSK: true,
      },
    },
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<WalletDetails {...props} />);
  });

  it('Should render properly', () => {
    expect(wrapper).toContainMatchingElement('.coin-container');
    expect(wrapper).toContainMatchingElements(1, 'section.coin-row');
  });
});
