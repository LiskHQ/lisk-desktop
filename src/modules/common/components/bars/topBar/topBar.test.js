import React from 'react';
import routes from 'src/routes/routes';
import DialogHolder from 'src/theme/dialog/holder';
import { mountWithRouter } from 'src/utils/testHelpers';
import accounts from '@tests/constants/wallets';
import TopBar from './topBar';

const mockInputNode = {
  focus: jest.fn(),
};

jest.mock(
  '@search/components/SearchBar',
  () =>
    function SearchBarMock({ onSearchClick, setSearchBarRef }) {
      setSearchBarRef(mockInputNode);
      return (
        <div className="searchBarMock">
          <div className="mockSearchResult" onClick={onSearchClick} />
        </div>
      );
    }
);

jest.mock(
  './navigationButtons',
  () =>
    function () {
      return <div />;
    }
);

describe('TopBar', () => {
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
    showDelegate: false,
    t: (val) => val,
    logOut: jest.fn(),
    location: { pathname: routes.dashboard.path, search: '' },
    history: {
      location: { pathname: routes.dashboard.path, search: '' },
      replace: () => {},
      push: jest.fn(),
    },
    transactions: [],
    token: {
      active: 'LSK',
      list: {
        LSK: true,
      },
    },
    network: {
      status: { online: true },
      name: 'Custom Node',
      networks: {
        LSK: {
          nodeUrl: 'hhtp://localhost:4000',
          nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
        },
      },
    },
    settings: {
      network: { name: 'Custom Nodee', address: 'hhtp://localhost:4000' },
    },
    settingsUpdated: jest.fn(),
    networkSet: jest.fn(),
  };

  beforeEach(() => {
    DialogHolder.showDialog = jest.fn();
  });

  it('renders <TopBar /> component', () => {
    const wrapper = mountWithRouter(TopBar, props, {
      pathname: routes.wallet.path,
    });
    expect(wrapper).toContainMatchingElement('.top-bar');
  });

  it('renders <TopBar /> component with user log in', () => {
    const wrapper = mountWithRouter(TopBar, props, {
      pathname: routes.wallet.path,
    });
    expect(wrapper).not.toContainMatchingElement('.signIn');
  });

  it('renders sign in component when user is logout', () => {
    const logoutProps = {
      ...props,
      account: {},
    };
    mountWithRouter(TopBar, logoutProps, {
      pathname: routes.wallet.path,
    });
  });

  it('renders the search component when user do click in the search icon', () => {
    const wrapper = mountWithRouter(TopBar, props, {
      pathname: routes.wallet.path,
    });
    expect(wrapper).toContainMatchingElement('img.search-icon');
    expect(wrapper.find('div.searchDropdown')).not.toHaveClassName('show');
  });

  it('renders searched value in the search container when the url contains a relevant search param', () => {
    const wrapper = mountWithRouter(
      TopBar,
      {
        ...props,
        history: {
          location: { pathname: routes.block.path, search: '?id=1L' },
        },
      },
      { pathname: routes.block.path }
    );
    expect(wrapper).toContainMatchingElement('img.search-icon');
    expect(wrapper).toContainMatchingElement('span.searchedValue');
    expect(wrapper.find('div.searchDropdown')).not.toHaveClassName('show');
  });

  it('renders searched value in the search container with WalletVisual when the url contains an account address', () => {
    const wrapper = mountWithRouter(
      TopBar,
      {
        ...props,
        history: {
          location: { pathname: routes.explorer.path, search: '?address=1L' },
        },
      },
      { pathname: routes.explorer.path }
    );
    expect(wrapper).toContainMatchingElement('img.search-icon');
    expect(wrapper).toContainMatchingElement('span.searchedValue');
    expect(wrapper).toContainMatchingElement('WalletVisual');
    expect(wrapper.find('div.searchDropdown')).not.toHaveClassName('show');
  });

  it('does not render searched value in the search container when the url contains an irrelevant search param ', () => {
    const wrapper = mountWithRouter(
      TopBar,
      {
        ...props,
        history: {
          location: {
            pathname: routes.explorer.path,
            search: '?somerandomparam=1L',
          },
        },
      },
      { pathname: routes.explorer.path }
    );
    expect(wrapper).toContainMatchingElement('img.search-icon');
    expect(wrapper).not.toContainMatchingElement('span.searchedValue');
    expect(wrapper).not.toContainMatchingElement('WalletVisual');
    expect(wrapper.find('div.searchDropdown')).not.toHaveClassName('show');
  });

  it('Should not navigate on Initialization screen', () => {
    const wrapper = mountWithRouter(TopBar, {
      ...props,
      history: {
        ...props.history,
        location: { pathname: routes.reclaim.path },
      },
    });
    wrapper.find('.bookmark-list-toggle').first().simulate('click');
    wrapper.find('.search-toggle').first().simulate('click');
    expect(props.history.push).not.toHaveBeenCalled();
  });
});
