import React from 'react';
import { mount } from 'enzyme';
import accounts from '@tests/constants/wallets';
import WalletsMonitor from './index';

const accountsApiResponse = Object.values(accounts);
describe('Top Accounts Monitor Page', () => {
  const props = {
    t: key => key,
    wallets: {
      isLoading: true,
      data: [],
      meta: null,
      loadData: jest.fn(),
      clearData: jest.fn(),
      urlSearchParams: {},
    },
    networkStatus: {
      data: {
        supply: 9999999999999,
      },
    },
  };

  const accountsWithData = {
    ...props.wallets,
    isLoading: false,
    data: [
      {
        summary: {
          address: accounts.delegate.summary.address,
        },
        dpos: {
          delegate: {
            username: 'geenesis',
          },
        },
        knowledge: {
          owner: 'Lisk',
          description: 'assetes',
        },
      },
      ...accountsApiResponse,
    ],
    meta: {
      count: accountsApiResponse.length + 1,
      offset: 0,
      total: accountsApiResponse.length * 3,
    },
  };

  const setup = properties => mount(<WalletsMonitor {...properties} />);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a page with header', () => {
    const wrapper = setup(props);
    expect(wrapper.find('Box header')).toIncludeText('All accounts');
  });

  it('renders table with accounts', () => {
    const wrapper = setup(props);
    expect(wrapper.find('.accounts-row')).toHaveLength(0);
    wrapper.setProps({ wallets: accountsWithData });
    expect(wrapper.find('.accounts-row').hostNodes()).toHaveLength(accountsApiResponse.length + 1);
  });

  it('shows error if API failed', () => {
    const wrapper = setup(props);
    const error = 'Loading failed';
    wrapper.setProps({
      wallets: {
        ...props.wallets,
        isLoading: false,
        error,
      },
    });
    expect(wrapper).toIncludeText(error);
  });
});
