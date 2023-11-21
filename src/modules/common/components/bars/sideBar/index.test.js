import React from 'react';
import { useSelector } from 'react-redux';
import routes from 'src/routes/routes';
import { useCurrentAccount } from '@account/hooks';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import { mockRewardsClaimable } from '@pos/reward/__fixtures__';
import { ApplicationBootstrapContext } from '@setup/react/app/ApplicationBootstrap';
import { mountWithRouter, mountWithRouterAndStore } from 'src/utils/testHelpers';
import SideBar from './index';

const mockCurrentAccount = mockSavedAccounts[0];

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('@account/hooks/useCurrentAccount');
jest.mock('@pos/reward/hooks/queries/useRewardsClaimable');

describe('SideBar', () => {
  let mockAppState;

  beforeEach(() => {
    useCurrentAccount.mockReturnValue([mockCurrentAccount]);
    useSelector.mockImplementation((callback) => callback(mockAppState));
    useRewardsClaimable.mockReturnValue({ data: mockRewardsClaimable });
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

  it('renders 7 menu items elements', () => {
    expect(wrapper).toContainMatchingElements(7, 'a');
  });

  it('shows sidebar toggle info on hover', () => {
    wrapper.simulate('mouseenter');
    expect(wrapper.find('SidebarToggle').exists()).toBeTruthy();
    wrapper.simulate('mouseleave');
    expect(wrapper.find('SidebarToggle').exists()).toBeFalsy();
  });

  describe('renders 7 menu items', () => {
    it('without labels if sideBarExpanded is false', () => {
      expect(wrapper).toContainMatchingElements(7, 'a');
      wrapper.find('a').forEach((link) => expect(link).not.toContain(/\w*/));
    });

    it('without labels if sideBarExpanded is true', () => {
      const expectedLinks = [
        'Wallet',
        'Applications',
        'Transactions',
        'Blocks',
        'Validators',
        'Accounts',
        'Network',
      ];

      mockAppState.settings = { ...mockAppState.settings, sideBarExpanded: true };
      wrapper = mountWithRouter(SideBar, myProps);
      wrapper.find('a').forEach((link, index) => expect(link).toHaveText(expectedLinks[index]));
    });
  });

  it('renders 7 disabled menu items on Initialization screen', () => {
    wrapper = mountWithRouter(SideBar, {
      ...myProps,
      isUserLogout: false,
      location: {
        pathname: routes.reclaim.path,
      },
    });
    expect(wrapper).toContainMatchingElements(7, 'a');
    expect(wrapper.find('a').at(0)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(1)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(2)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(3)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(4)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(5)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(6)).toHaveClassName('disabled');
  });

  it('should render notification when there is a reward and the side bar is shrunk', () => {
    const Component = (props) => (
      <ApplicationBootstrapContext.Provider
        value={{ appEvents: { transactions: { rewards: [{ reward: 10000 }] } } }}
      >
        <SideBar {...props} />
      </ApplicationBootstrapContext.Provider>
    );

    wrapper = mountWithRouterAndStore(
      Component,
      {
        ...myProps,
        isUserLogout: false,
        location: { pathname: routes.reclaim.path },
      },
      { settings: { sideBarExpanded: false } }
    );
    expect(wrapper.find('Badge.badge')).toExist();
  });

  it('should render notification when there is a reward and the side bar is collapsed', () => {
    const Component = (props) => (
      <ApplicationBootstrapContext.Provider
        value={{ appEvents: { transactions: { rewards: [{ reward: 10000 }] } } }}
      >
        <SideBar {...props} />
      </ApplicationBootstrapContext.Provider>
    );

    wrapper = mountWithRouterAndStore(
      Component,
      {
        ...myProps,
        isUserLogout: false,
        location: { pathname: routes.reclaim.path },
      },
      { settings: { sideBarExpanded: true } }
    );
    expect(wrapper.find('Badge.badge')).toExist();
  });
});
