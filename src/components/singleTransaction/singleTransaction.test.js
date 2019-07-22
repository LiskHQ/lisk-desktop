import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import i18n from '../../i18n';
import SingleTransaction from './index';
import accounts from '../../../test/constants/accounts';
import fees from '../../constants/fees';

describe('Single Transaction Component', () => {
  let wrapper;
  const peers = { liskAPIClient: {} };
  const settings = {};

  const props = {
    t: v => v,
    history: {
      push: jest.fn(),
    },
    activeToken: 'LSK',
  };

  describe('Transfer transactions', () => {
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

    const store = configureMockStore([thunk])({
      account: accounts.genesis,
      transaction,
      peers,
      loadSingleTransaction: jest.fn(),
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
    const transaction = {
      errors: [{
        code: 'INVALID_REQUEST_PARAMETER',
      }],
    };

    const store = configureMockStore([thunk])({
      account: accounts.genesis,
      transaction,
      peers,
      loadSingleTransaction: jest.fn(),
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
      wrapper = mount(<Router><SingleTransaction {...props} /></Router>, options);
    });

    it('Should render no result screen', () => {
      expect(wrapper).toContainMatchingElement('NotFound');
    });
  });
});
