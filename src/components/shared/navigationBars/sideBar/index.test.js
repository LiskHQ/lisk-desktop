import { useSelector } from 'react-redux';
import SideBar from './index';
import routes from '../../../../constants/routes';
import { mountWithRouter } from '../../../../utils/testHelpers';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('SideBar', () => {
  const mockAppState = {
    settings: {
      token: {
        active: 'LSK',
      },
    },
    account: {
      info: {},
    },
    network: {
      name: 'testnet',
      serviceUrl: 'someUrl',
    },
  };

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
    wrapper = mountWithRouter(SideBar, myProps);
  });

  it('renders 8 menu items elements', () => {
    const expectedLinks = [
      'Dashboard',
      'Wallet',
      'Voting',
      'Network',
      'Transactions',
      'Blocks',
      'Accounts',
      'Delegates',
    ];
    expect(wrapper).toContainMatchingElements(8, 'a');
    wrapper.find('a').forEach((link, index) => expect(link).toHaveText(expectedLinks[index]));
  });

  it('renders 8 menu items but only Wallet is disabled when user is logged out', () => {
    wrapper = mountWithRouter(SideBar, myProps);

    expect(wrapper).toContainMatchingElements(8, 'a');
    expect(wrapper).toContainExactlyOneMatchingElement('a.disabled');
    expect(wrapper.find('a').at(0)).not.toHaveClassName('disabled');
    expect(wrapper.find('a').at(1)).toHaveClassName('disabled');
    expect(wrapper.find('a').at(2)).not.toHaveClassName('disabled');
    expect(wrapper.find('a').at(3)).not.toHaveClassName('disabled');
    expect(wrapper.find('a').at(4)).not.toHaveClassName('disabled');
    expect(wrapper.find('a').at(5)).not.toHaveClassName('disabled');
    expect(wrapper.find('a').at(6)).not.toHaveClassName('disabled');
    expect(wrapper.find('a').at(7)).not.toHaveClassName('disabled');
  });
});
