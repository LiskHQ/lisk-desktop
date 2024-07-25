import { useSelector } from 'react-redux';
import routes from 'src/routes/routes';
import { useCurrentAccount } from '@account/hooks';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import { mockRewardsClaimable } from '@pos/reward/__fixtures__';
import { mountWithRouter } from 'src/utils/testHelpers';
import menuLinks from './menuLinks';
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
  const menuItems = menuLinks(myProps.t);

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

  it(`renders ${menuItems.length} menu items elements`, () => {
    expect(wrapper).toContainMatchingElements(menuLinks.length, 'a');
  });

  it('shows sidebar toggle info on hover', () => {
    wrapper.simulate('mouseenter');
    expect(wrapper.find('SidebarToggle').exists()).toBeTruthy();
    wrapper.simulate('mouseleave');
    expect(wrapper.find('SidebarToggle').exists()).toBeFalsy();
  });

  describe(`renders ${menuItems.length} menu items`, () => {
    it('without labels if sideBarExpanded is false', () => {
      expect(wrapper).toContainMatchingElements(menuLinks.length, 'a');
      wrapper.find('a').forEach((link) => expect(link).not.toContain(/\w*/));
    });

    it('without labels if sideBarExpanded is true', () => {
      const expectedLinks = ['Applications'];

      mockAppState.settings = { ...mockAppState.settings, sideBarExpanded: true };
      wrapper = mountWithRouter(SideBar, myProps);
      wrapper.find('a').forEach((link, index) => expect(link).toHaveText(expectedLinks[index]));
    });
  });

  it(`renders ${menuItems.length} disabled menu items on Initialization screen`, () => {
    wrapper = mountWithRouter(SideBar, {
      ...myProps,
      isUserLogout: false,
      location: {
        pathname: routes.reclaim.path,
      },
    });
    expect(wrapper).toContainMatchingElements(menuLinks.length, 'a');
    menuItems[0].forEach((_, index) => {
      expect(wrapper.find('a').at(index)).toHaveClassName('disabled');
    });
  });
});
