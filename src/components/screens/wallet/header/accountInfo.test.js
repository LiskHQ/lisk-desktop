import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import accounts from '../../../../../test/constants/accounts';
import HeaderAccountInfo from './accountInfo';

describe('HeaderAccountInfo Component', () => {
  const defaultProps = {
    address: accounts.genesis.address,
    bookmarks: { LSK: [], BTC: [] },
    delegate: {},
    t: v => v,
    token: 'LSK',
  };
  const mockStore = {
    account: {
      info: {
        LSK: accounts.genesis,
      },
    },
  };

  it('Should show information for own account', () => {
    const props = { ...defaultProps };
    const wrapper = mount(<Provider store={configureStore()(mockStore)}>
      <HeaderAccountInfo {...props} />
    </Provider>);
    expect(wrapper).toContainExactlyOneMatchingElement('.account-label');
    expect(wrapper.find('.account-label')).toHaveText('My Account');
  });

  it('Should show information for bookmark', () => {
    const props = {
      ...defaultProps,
      bookmarks: {
        LSK: [{
          address: accounts.empty_account.address,
          title: 'bookmark-test',
        }],
        BTC: [],
      },
      address: accounts.empty_account.address,
    };
    const wrapper = mount(<HeaderAccountInfo {...props} />);
    expect(wrapper.find('.title')).toHaveText('bookmark-test');
  });

  it('Should show information for delegate account', () => {
    const props = {
      ...defaultProps,
      address: accounts.delegate.address,
      delegate: accounts.delegate,
    };
    const wrapper = mount(<HeaderAccountInfo {...props} />);
    expect(wrapper).toContainExactlyOneMatchingElement('.account-label');
    expect(wrapper.find('.title')).toHaveText(props.delegate.username);
    expect(wrapper.find('.account-label')).toHaveText('Delegate #{{rank}}');
  });

  it('Should show information for not bookmark', () => {
    const props = {
      ...defaultProps,
      address: accounts.empty_account.address,
    };
    const wrapper = mount(<HeaderAccountInfo {...props} />);
    expect(wrapper).not.toContainMatchingElement('.account-label');
  });
});
