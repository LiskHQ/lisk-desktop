import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import TransactionHeader from './index';
import accounts from '../../../../../test/constants/accounts';
import routes from '../../../../constants/routes';

describe('Transactions Overview Header', () => {
  let wrapper;

  const props = {
    account: accounts.genesis,
    bookmarks: {
      LSK: [],
      BTC: [],
    },
    address: accounts.genesis.address,
    match: { url: routes.wallet.path },
    balance: accounts.genesis.balance,
    activeToken: 'LSK',
    t: str => str,
  };

  describe('Current user wallet', () => {
    beforeEach(() => {
      wrapper = mount(<TransactionHeader {...props} />);
    });

    it('Should render header and Request and Send LSK buttons', () => {
      const header = wrapper.find('h1');
      expect(header.text()).to.includes('Wallet');
      expect(wrapper).to.have.descendants('.buttonsHolder');
    });

    it('Should toggle request LSK dropdown', () => {
      wrapper.find('.requestContainer button').first().simulate('click');
      expect(wrapper.find('.requestContainer')).to.have.descendants('.show');
      wrapper.find('.requestContainer button').first().simulate('click');
    });
  });

  describe('Another user wallet', () => {
    const anotherUserProps = {
      ...props,
      address: accounts.delegate.address,
      balance: accounts.delegate.balance,
      match: { urls: `${routes.accounts.pathPrefix}${routes.accounts.path}/${accounts.delegate.address}` },
    };
    it('Should toggle bookmark dropdown', () => {
      wrapper = mount(<TransactionHeader {...anotherUserProps} />);
      expect(wrapper.find('.bookmark-account')).to.not.have.descendants('.show');
      wrapper.find('.bookmark-account button').first().simulate('click');
      expect(wrapper.find('.bookmark-account')).to.have.descendants('.show');
      wrapper.find('.bookmark-account button').first().simulate('click');
      expect(wrapper.find('.bookmark-account')).to.not.have.descendants('.show');
    });

    it('Should show Account bookmarked dropdown if already bookmarked', () => {
      const bookmarks = {
        LSK: [
          accounts.delegate,
        ],
        BTC: [],
      };
      wrapper = mount(
        <TransactionHeader {...{
          ...anotherUserProps,
          bookmarks,
        }}
        />,
      );
      expect(wrapper.find('.bookmark-account button').first().text()).to.equal('Edit bookmark');
    });

    it('Should close dropdown after clicking on a dropdown button', () => {
      const bookmarks = {
        LSK: [
          accounts.delegate,
        ],
        BTC: [],
      };
      wrapper = mount(
        <TransactionHeader {...{
          ...anotherUserProps,
          bookmarks,
        }}
        />,
      );
      wrapper.find('.bookmark-account-button').first().simulate('click');
      expect(wrapper.find('Dropdown')).to.have.prop('showDropdown', true);
      wrapper.find('.bookmark-button').last().simulate('click');
      expect(wrapper.find('Dropdown')).to.have.prop('showDropdown', false);
    });
  });
});
