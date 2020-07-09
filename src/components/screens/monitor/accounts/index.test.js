import React from 'react';
import { mount } from 'enzyme';
import { AccountsPure } from './index';
import accounts from '../../../../../test/constants/accounts';

jest.mock('../../../../constants/monitor', () => ({ DEFAULT_LIMIT: 4 }));

const accountsApiResponse = Object.values(accounts);

describe('Top Accounts Monitor Page', () => {
  let props;
  let accountsWithData;
  let wrapper;

  const setup = properties => mount(<AccountsPure {...properties} />);

  beforeEach(() => {
    props = {
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

    accountsWithData = {
      ...props.accounts,
      isLoading: false,
      data: [
        {
          address: '1234567L',
          delegate: {
            username: 'geenesis',
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

    wrapper = setup(props);
  });

  it('renders a page with header', () => {
    expect(wrapper.find('Box header')).toIncludeText('All accounts');
  });

  it('renders table with accounts', () => {
    expect(wrapper.find('.accounts-row')).toHaveLength(0);
    wrapper.setProps({ accounts: accountsWithData });
    expect(wrapper.find('.accounts-row').hostNodes()).toHaveLength(accountsApiResponse.length + 1);
  });

  it('shows error if API failed', () => {
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
