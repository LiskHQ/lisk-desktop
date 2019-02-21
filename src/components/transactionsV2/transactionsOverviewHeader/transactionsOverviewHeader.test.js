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

describe('Transactions Overview Header', () => {
  let wrapper;
  const store = configureMockStore([thunk])({
    settings: { currency: 'USD' },
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
    followedAccounts: [],
    address: accounts.genesis.address,
    match: { url: routes.wallet.path },
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
      wrapper.setProps({
        children: React.cloneElement(wrapper.props().children, {
          followedAccounts: [{
            ...props.account,
            title: 'Some Title',
          }],
        }),
      });
      wrapper.update();
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
});
