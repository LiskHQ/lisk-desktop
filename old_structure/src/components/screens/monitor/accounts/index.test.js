import React from 'react';
import { mount } from 'enzyme';
import { AccountsPure } from './index';
import accounts from '../../../../../test/constants/accounts';

const accountsApiResponse = Object.values(accounts);
describe('Top Accounts Monitor Page', () => {
  const props = {
    t: key => key,
    accounts: {
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
    ...props.accounts,
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

  const setup = properties => mount(<AccountsPure {...properties} />);

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
    wrapper.setProps({ accounts: accountsWithData });
    expect(wrapper.find('.accounts-row').hostNodes()).toHaveLength(accountsApiResponse.length + 1);
  });

  it('shows error if API failed', () => {
    const wrapper = setup(props);
    const error = 'Loading failed';
    wrapper.setProps({
      accounts: {
        ...props.accounts,
        isLoading: false,
        error,
      },
    });
    expect(wrapper).toIncludeText(error);
  });
});
