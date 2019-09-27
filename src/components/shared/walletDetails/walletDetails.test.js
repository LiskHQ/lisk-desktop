import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { MemoryRouter as Router } from 'react-router-dom';
import WalletDetails from './walletDetails';
import store from '../../../store';


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
          BTC: true,
        },
      },
    },
    t: key => key,
  };

  const options = {
    context: { store },
    childContextTypes: { store: PropTypes.object.isRequired },
  };

  beforeEach(() => {
    wrapper = mount(<Router><WalletDetails {...props} /></Router>, options);
  });

  it('Should render properly', () => {
    expect(wrapper).toContainMatchingElement('.coin-container');
    expect(wrapper).toContainMatchingElements(2, 'section.coin-row');
  });
});
