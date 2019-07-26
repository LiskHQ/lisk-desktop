import React from 'react';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import TopBar from './topBar';
import routes from '../../constants/routes';
import accounts from '../../../test/constants/accounts';

jest.mock('../searchBar', () => function SearchBarMock() {
  return (
    <div className="searchBarMock" />
  );
});

describe('TopBar', () => {
  let wrapper;
  const account = {
    passphrase: accounts.genesis.passphrase,
    expireTime: Date.now() + 60000,
    address: '12345L',
    info: {
      LSK: {
        address: '12345L',
        balance: 120,
      },
    },
  };

  const props = {
    account,
    autologout: true,
    setActiveDialog: jest.fn(),
    location: { pathname: routes.dashboard.path },
    showDelegate: false,
    t: val => val,
    logOut: jest.fn(),
    history: {
      replace: () => {},
      push: jest.fn(),
    },
    transactions: [],
    token: {
      active: 'LSK',
      list: {
        LSK: true,
        BTC: true,
      },
    },
    peers: {
      liskAPIClient: {},
      options: {
        code: 2,
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      },
      status: {
        online: true,
      },
    },
    settingsUpdated: jest.fn(),
  };

  const history = {
    location: { pathname: routes.dashboard.path },
    createHref: () => {},
    push: () => {},
    replace: () => {},
  };

  const store = configureStore([thunk])({
    account,
    history,
    settings: {
      autloLog: true,
      token: {
        active: 'LSK',
        list: {
          LSK: true,
          BTC: false,
        },
      },
    },
    search: {
      suggestions: {
        addresses: [],
        transactions: [],
        delegates: [],
      },
    },
    peers: {
      liskAPIClient: {},
      options: {
        code: 2,
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      },
      status: {
        online: true,
      },
    },
  });

  const myOptions = {
    context: {
      store, history, i18n, router: { route: history, history },
    },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    wrapper = mount(<TopBar {...props} />, myOptions);
  });

  it('renders <TopBar /> component', () => {
    expect(wrapper).toContainMatchingElement('.top-bar');
  });

  it('renders <TopBar /> component with user log in', () => {
    expect(wrapper).toContainMatchingElement('MenuItems');
    expect(wrapper).toContainMatchingElement('UserAccount');
    expect(wrapper).not.toContainMatchingElement('.signIn');
  });

  it('renders 3 menu items', () => {
    expect(wrapper).toContainMatchingElements(3, 'a.item');
  });

  it('logout user when user do a click on logout function', () => {
    wrapper.find('.accountInfo').at(0).simulate('click');
    wrapper.update();
    wrapper.find('.logout').simulate('click');
    wrapper.update();
    expect(props.logOut).toHaveBeenCalled();
  });

  it('renders sign in component when user is logout', () => {
    const logoutProps = {
      ...props,
      account: {},
    };
    wrapper = mount(<TopBar {...logoutProps} />, myOptions);
    expect(wrapper).toContainMatchingElement('.signIn');
  });

  it('renders the search component when user do click in the search icon', () => {
    expect(wrapper).toContainMatchingElement('img.search-icon');
    expect(wrapper.find('div.searchDropdown')).not.toHaveClassName('show');
    wrapper.find('img.search-icon').simulate('click');
    expect(wrapper.find('div.searchDropdown')).toHaveClassName('show');
    wrapper.find('img.search-icon').simulate('click');
    expect(wrapper.find('div.searchDropdown')).not.toHaveClassName('show');
    wrapper.find('img.topbar-logo').simulate('click');
  });
});
