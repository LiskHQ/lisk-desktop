import { useSelector } from 'react-redux';
import routes from '@screens/router/routes';
import { mountWithRouter } from '@common/utilities/testHelpers';
import SideBar from './index';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('SideBar', () => {
  let mockAppState;

  beforeEach(() => {
    useSelector.mockImplementation(callback => callback(mockAppState));
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  let wrapper;

  const myProps = {
    location: {
      pathname: routes.dashboard.path,
    },
    t: val => val,
  };

  beforeEach(() => {
    mockAppState = {
      settings: {
        token: {
          active: 'LSK',
        },
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

  it('renders 7 menu items elements', () => {
    expect(wrapper).toContainMatchingElements(7, 'a');
  });

  describe('renders 7 menu items', () => {
    it('without labels if sideBarExpanded is false', () => {
      expect(wrapper).toContainMatchingElements(7, 'a');
      wrapper.find('a').forEach(link => expect(link).not.toContain(/\w*/));
    });

    it('without labels if sideBarExpanded is true', () => {
      const expectedLinks = [
        'Dashboard',
        'Wallet',
        'Network',
        'Transactions',
        'Blocks',
        'Accounts',
        'Delegates',
      ];

      mockAppState.settings = { ...mockAppState.settings, sideBarExpanded: true };
      wrapper = mountWithRouter(SideBar, myProps);
      wrapper.find('a').forEach((link, index) => expect(link).toHaveText(expectedLinks[index]));
    });
  });

  it('renders 7 menu items but only Wallet is disabled when user is logged out', () => {
    expect(wrapper).toContainMatchingElements(7, 'a');
    expect(wrapper).toContainExactlyOneMatchingElement('a.disabled');
    expect(wrapper.find('a').at(0)).not.toHaveClassName('disabled');
    expect(wrapper.find('a').at(1)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(2)).not.toHaveClassName('disabled');
    expect(wrapper.find('a').at(3)).not.toHaveClassName('disabled');
    expect(wrapper.find('a').at(4)).not.toHaveClassName('disabled');
    expect(wrapper.find('a').at(5)).not.toHaveClassName('disabled');
    expect(wrapper.find('a').at(6)).not.toHaveClassName('disabled');
  });

  it('renders 7 disabled menu items on Initialization screen', () => {
    wrapper = mountWithRouter(
      SideBar,
      {
        ...myProps,
        isUserLogout: false,
        location: {
          pathname: routes.reclaim.path,
        },
      },
    );
    expect(wrapper).toContainMatchingElements(7, 'a');
    expect(wrapper.find('a').at(0)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(1)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(2)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(3)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(4)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(5)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(6)).toHaveClassName('disabled');
  });
});
