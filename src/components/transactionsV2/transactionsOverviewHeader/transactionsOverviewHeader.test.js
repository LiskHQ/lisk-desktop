import React from 'react';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../../../i18n';
import TransactionHeader from './transactionsOverviewHeader';
import accounts from '../../../../test/constants/accounts';
import routes from '../../../constants/routes';
import { tokenMap } from '../../../constants/tokens';

describe('Transactions Overview Header', () => {
  let wrapper;
  const store = configureMockStore([thunk])({
    bookmarks: {
      LSK: [],
      BTC: [],
    },
    settings: { currency: 'USD', token: { active: tokenMap.LSK.key } },
    settingsUpdated: () => {},
    liskService: {
      success: true,
      LSK: {
        USD: 1,
      },
    },
  });

  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };

  const props = {
    account: accounts.genesis,
    bookmarks: {
      LSK: [],
      BTC: [],
    },
    address: accounts.genesis.address,
    match: { url: routes.wallet.path },
    balance: accounts.genesis.balance,
  };

  describe('Current user wallet', () => {
    beforeEach(() => {
      wrapper = mount(<MemoryRouter>
        <TransactionHeader {...props} />
      </MemoryRouter>, options);
    });

    it('Should render Account Info and Request and Send LSK buttons', () => {
      const accountInfo = wrapper.find('.accountInfo');
      expect(accountInfo.text()).to.includes(accounts.genesis.address);
      expect(wrapper).to.have.descendants('.buttonsHolder');
    });

    it('Should render bookmark title instead of Wallet if address is in user bookmark', () => {
      const bookmarkProps = {
        ...props,
        bookmarks: {
          LSK: [{
            ...props.account,
            title: 'Some Title',
          }],
          BTC: [],
        },
      };
      wrapper = mount(<MemoryRouter>
        <TransactionHeader {...bookmarkProps} />
      </MemoryRouter>, options);
      const accountInfo = wrapper.find('.accountInfo');
      expect(accountInfo.text()).to.includes('Some Title');
    });

    it('Should toggle request LSK dropdown', () => {
      expect(wrapper.find('.requestContainer')).to.not.have.descendants('.show');
      wrapper.find('.requestContainer button').first().simulate('click');
      expect(wrapper.find('.requestContainer')).to.have.descendants('.show');
      wrapper.find('.requestContainer button').first().simulate('click');
      expect(wrapper.find('.requestContainer')).to.not.have.descendants('.show');
    });
  });

  describe('Another user wallet', () => {
    const anotherUserProps = {
      ...props,
      address: accounts.delegate.address,
      balance: accounts.delegate.balance,
      match: { urls: `${routes.accounts.pathPrefix}${routes.accounts.path}V2/${accounts.delegate.address}` },
    };

    beforeEach(() => {
      wrapper = mount(<MemoryRouter>
        <TransactionHeader {...anotherUserProps} />
      </MemoryRouter>, options);
    });

    it('Should toggle bookmark dropdown', () => {
      expect(wrapper.find('.bookmark-account')).to.not.have.descendants('.show');
      wrapper.find('.bookmark-account button').first().simulate('click');
      expect(wrapper.find('.bookmark-account')).to.have.descendants('.show');
      wrapper.find('.bookmark-account button').first().simulate('click');
      expect(wrapper.find('.bookmark-account')).to.not.have.descendants('.show');
    });
  });
});
