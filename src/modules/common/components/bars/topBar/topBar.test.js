import React from 'react';
import routes from 'src/routes/routes';
import DialogHolder from 'src/theme/dialog/holder';
import { mountWithRouterAndQueryClient } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockHWCurrentDevice } from '@hardwareWallet/__fixtures__';
import { useCurrentAccount } from 'src/modules/account/hooks';
import TopBar from './topBar';

const mockState = {
  account: {
    list: [],
  },
  blockChainApplications: {
    current: {},
  },
  network: {
    status: { online: true },
    name: 'Custom Node',
  },
  hardwareWallet: {
    currentDevice: mockHWCurrentDevice,
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
jest.mock('@walletconnect/sign-client', () => ({
  init: jest.fn().mockResolvedValue(Promise.resolve({ mock: true })),
}));
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn(str => str),
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
      replace: () => { },
      push: jest.fn(),
    },
    settingsUpdated: jest.fn(),
    networkSet: jest.fn(),
  };

  beforeEach(() => {
    DialogHolder.showDialog = jest.fn();
  });

  it('renders <TopBar /> component', () => {
    const wrapper = mountWithRouterAndQueryClient(TopBar, props, {
      pathname: routes.wallet.path,
    });
    expect(wrapper).toContainMatchingElement('.top-bar');
  });

  it('renders <TopBar /> component with user log in', () => {
    const wrapper = mountWithRouterAndQueryClient(TopBar, props, {
      pathname: routes.wallet.path,
    });
    expect(wrapper).not.toContainMatchingElement('.signIn');
  });

  it('renders <AccountManagementDropdown /> component if current account exists', () => {
    const wrapper = mountWithRouterAndQueryClient(TopBar, props, {
      pathname: routes.wallet.path,
    });
    expect(wrapper).toContainMatchingElement('.account-management-dropdown');
  });

  it('renders <AccountManagementDropdown /> component if current account exists and updates background on click', () => {
    const wrapper = mountWithRouterAndQueryClient(TopBar, props, {
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
    const wrapper = mountWithRouterAndQueryClient(TopBar, props, {
      pathname: routes.wallet.path,
    });
    expect(wrapper).not.toContainMatchingElement('.account-management-dropdown');
  });


  it('renders the search component when user do click in the search icon', () => {
    const wrapper = mountWithRouterAndQueryClient(TopBar, props, {
      pathname: routes.wallet.path,
    });
    expect(wrapper.find('div.searchDropdown')).not.toHaveClassName('show');
  });

});
