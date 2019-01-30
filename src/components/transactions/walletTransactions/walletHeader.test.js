import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../../../i18n';
import WalletHeader from './walletHeader';
import routes from '../../../constants/routes';
import accounts from '../../../../test/constants/accounts';

describe('Wallet Header', () => {
  let wrapper;
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    account: accounts.genesis,
    followedAccounts: [],
    match: { url: routes.wallet.path },
    address: accounts.genesis.address,
  };

  beforeEach(() => {
    wrapper = mount(<MemoryRouter>
      <WalletHeader {...props} />
    </MemoryRouter>, options);
  });

  it('Should render Account Info and Request and Send LSK buttons', () => {
    const accountInfo = wrapper.find('.accountInfo');
    expect(accountInfo.text()).to.includes(accounts.genesis.address);
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
});
