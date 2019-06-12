import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import MyAccount from './myAccount';


describe('MyAccount', () => {
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

  beforeEach(() => {
    wrapper = mount(<Router><MyAccount {...props} /></Router>);
  });

  it('Should render properly', () => {
    expect(wrapper).toContainMatchingElement('.coin-container');
    expect(wrapper).toContainMatchingElements(2, '.coin-row');
  });
});
