import { useSelector } from 'react-redux';
import routes from 'src/routes/routes';
import { useCurrentAccount } from '@account/hooks';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mountWithRouter } from 'src/utils/testHelpers';
import SideBar from './index';

const mockCurrentAccount = mockSavedAccounts[0];

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('@account/hooks/useCurrentAccount.js');

describe('SideBar', () => {
  let mockAppState;

  beforeEach(() => {
    useCurrentAccount.mockReturnValue([mockCurrentAccount]);
    useSelector.mockImplementation((callback) => callback(mockAppState));
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  let wrapper;

  const myProps = {
    location: {
      pathname: routes.wallet.path,
    },
    t: (val) => val,
  };

  beforeEach(() => {
    mockAppState = {
      settings: {},
      token: {
        active: 'LSK',
      },
      wallet: {
        info: {},
      },
      network: {
        name: 'testnet',
        serviceUrl: 'someUrl',
        status: {
          online: true,
        },
      },
    };

    wrapper = mountWithRouter(SideBar, myProps);
  });

  it('renders 6 menu items elements', () => {
    expect(wrapper).toContainMatchingElements(6, 'a');
  });

  describe('renders 6 menu items', () => {
    it('without labels if sideBarExpanded is false', () => {
      expect(wrapper).toContainMatchingElements(6, 'a');
      wrapper.find('a').forEach((link) => expect(link).not.toContain(/\w*/));
    });

    it('without labels if sideBarExpanded is true', () => {
      const expectedLinks = [
        'Wallet',
        'Applications',
        'Network',
        'Transactions',
        'Blocks',
        'Validators',
      ];

      mockAppState.settings = { ...mockAppState.settings, sideBarExpanded: true };
      wrapper = mountWithRouter(SideBar, myProps);
      wrapper.find('a').forEach((link, index) => expect(link).toHaveText(expectedLinks[index]));
    });
  });

  it('renders 6 disabled menu items on Initialization screen', () => {
    wrapper = mountWithRouter(SideBar, {
      ...myProps,
      isUserLogout: false,
      location: {
        pathname: routes.reclaim.path,
      },
    });
    expect(wrapper).toContainMatchingElements(6, 'a');
    expect(wrapper.find('a').at(0)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(1)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(2)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(3)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(4)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(5)).toHaveClassName('disabled');
  });
});
