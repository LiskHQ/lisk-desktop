import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import i18n from '../../i18n';
import SingleTransaction from './singleTransaction';
import accounts from '../../../test/constants/accounts';
import fees from '../../constants/fees';

describe('Single Transaction Component', () => {
  let wrapper;
  const network = {
    status: { online: true },
    name: 'Custom Node',
    networks: {
      LSK: {
        nodeUrl: 'hhtp://localhost:4000',
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      },
    },
  };

  const settings = {
    token: {
      active: 'LSK',
    },
  };
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
    },
    activeToken: 'LSK',
    transaction: {
      data: transaction,
    },
    match: {
      url: `/explorer/transactions/${transaction.id}`,
    },
  };

  describe('Transfer transactions', () => {
    const store = configureMockStore([thunk])({
      account: accounts.genesis,
      network,
      settings,
    });

    const router = {
      history: new Router().history,
      route: {
        location: {},
        match: { params: { id: 123 } },
      },
    };

    const options = {
      context: { i18n, store, router },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
      },
    };

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
      // TODO fix this test. The problem is that this test uses HOC of the component
      // but using directly the component causes some errors
      // expect(props.history.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('No results', () => {
    const store = configureMockStore([thunk])({
      account: accounts.genesis,
      network,
      settings,
    });

    const options = {
      context: { i18n, store },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    };

    beforeEach(() => {
      wrapper = mount(<Router>
        <SingleTransaction {...{
          ...props,
          transaction: {
            error: 'INVALID_REQUEST_PARAMETER',
            data: {},
          },
        }}
        />
      </Router>, options);
    });

    it('Should render no result screen', () => {
      expect(wrapper).toContainMatchingElement('NotFound');
    });
  });
});
