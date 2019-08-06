import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import SingleTransaction from './singleTransaction';
import accounts from '../../../test/constants/accounts';
import fees from '../../constants/fees';

describe('Single Transaction Component', () => {
  let wrapper;
  const transaction = {
    senderId: accounts.genesis.address,
    recipientId: accounts.delegate.address,
    amount: 100000,
    asset: {
      data: 'Transaction message',
    },
    confirmation: 1,
    type: 0,
    id: 123,
    fee: fees.send,
    timestamp: Date.now(),
  };

  const props = {
    t: v => v,
    history: {
      push: jest.fn(),
      replace: jest.fn(),
      createHref: jest.fn(),
    },
    activeToken: 'LSK',
    transaction: {
      data: transaction,
    },
    delegates: {
      data: {},
    },
    match: {
      url: `/explorer/transactions/${transaction.id}`,
    },
  };
  const router = {
    route: {
      location: {},
      match: { params: { id: transaction.id } },
    },
    history: props.history,
  };

  const options = {
    context: { router },
    childContextTypes: {
      router: PropTypes.object.isRequired,
    },
  };

  describe('Transfer transactions', () => {
    beforeEach(() => {
      wrapper = mount(<SingleTransaction {...props} />, options);
    });

    it('Should render transaction details', () => {
      expect(wrapper.find('.detailsHeader h1')).toHaveText('Transaction details');
      expect(wrapper.find('.transaction-id .copy-title').first().text().trim()).toBe(`${transaction.id}`);
    });

    it('Should redirect to dashboard if activeToken changes', () => {
      wrapper.setProps({
        ...props,
        activeToken: 'BTC',
      });
      expect(props.history.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('No results', () => {
    it('Should render no result screen', () => {
      wrapper = mount(<SingleTransaction {...{
        ...props,
        transaction: {
          error: 'INVALID_REQUEST_PARAMETER',
          data: {},
        },
      }}
      />, options);
      expect(wrapper).toContainMatchingElement('NotFound');
    });
  });
});
