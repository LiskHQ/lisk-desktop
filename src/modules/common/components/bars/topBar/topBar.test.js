import React from 'react';
import routes from 'src/routes/routes';
import DialogHolder from 'src/theme/dialog/holder';
import { mountWithRouter } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useCurrentAccount } from 'src/modules/account/hooks';
import TopBar from './topBar';

const mockState = {
  account: {
    list: [],
  },
  blockChainApplications: {
    current: {},
    applications: {},
  },
  network: {
    status: { online: true },
    name: 'Custom Node',
  },
  settings: {
    network: { name: 'Custom Nodee', address: 'hhtp://localhost:4000' },
  },
};

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));


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

const mockCurrentAccount = mockSavedAccounts[0];
jest.mock('@account/hooks/useCurrentAccount.js');
useCurrentAccount.mockImplementation(() => [mockCurrentAccount]);

describe('TopBar', () => {

  const props = {
    t: (val) => val,
    logOut: jest.fn(),
    location: { pathname: routes.dashboard.path, search: '' },
    history: {
      location: { pathname: routes.dashboard.path, search: '' },
      replace: () => {},
      push: jest.fn(),
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

  it('renders <AccountManagementDropdown /> component if current account exists', () => {
    const wrapper = mountWithRouter(TopBar, props, {
      pathname: routes.wallet.path,
    });
    expect(wrapper).toContainMatchingElement('.account-management-dropdown');
  });

  it('renders <AccountManagementDropdown /> component if current account exists and updates background on click', () => {
    const wrapper = mountWithRouter(TopBar, props, {
      pathname: routes.wallet.path,
    });
    expect(wrapper).toContainMatchingElement('.account-management-dropdown');
    wrapper.find('.account-management-dropdown').at(0).simulate('click');
    expect(wrapper.find('.user-menu-section').hasClass(/menuOpen/)).toBe(true);
    wrapper.find('.account-management-dropdown').at(0).simulate('click');
    expect(wrapper.find('.user-menu-section').hasClass(/menuOpen/)).toBe(false);
  });

  it('does not render <AccountManagementDropdown /> component if current account does not exist', () => {
    useCurrentAccount.mockImplementation(() => [{}]);
    const wrapper = mountWithRouter(TopBar, props, {
      pathname: routes.wallet.path,
    });
    expect(wrapper).not.toContainMatchingElement('.account-management-dropdown');
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
