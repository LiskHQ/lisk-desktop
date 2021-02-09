import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import fakeStore from '../../../../../test/unit-test-utils/fakeStore';
import Delegates from './delegates';
import delegatesList from '../../../../../test/constants/delegates';

const activeDelegates = delegatesList.map(item => ({ ...item, publicKey: item.account.publicKey }));
activeDelegates.push({
  username: 'additional',
  vote: '0',
  rewards: '0',
  producedBlocks: 28,
  missedBlocks: 0,
  productivity: 0,
  publicKey: 'test_pbk',
  rank: 999,
  address: '14018336151296112016L',
  account: {
    address: '14018336151296112016L',
    publicKey: 'test_pbk',
    secondPublicKey: '',
  },
  delegateWeight: 0,
});

describe('Delegates monitor page', () => {
  let props;
  let wrapper;

  const store = fakeStore();

  const setup = properties => mount(
    <Provider store={store}>
      <Delegates {...properties} />
    </Provider>,
  );

  const switchTab = (tab) => {
    wrapper.find(`.tab.${tab}`).simulate('click');
    wrapper.setProps({
      filters: {
        ...props.filters,
        tab,
      },
    });
  };

  beforeEach(() => {
    props = {
      t: key => key,
      delegates: {
        isLoading: true,
        data: activeDelegates,
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      standByDelegates: {
        isLoading: true,
        data: [],
        meta: { total: 100, count: 10, offset: 0 },
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      sanctionedDelegates: {
        isLoading: true,
        data: [],

        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      watchedDelegates: {
        isLoading: true,
        data: [],
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      watchList: [],
      chartActiveAndStandbyData: {
        isLoading: false,
        data: '589',
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      chartRegisteredDelegatesData: {
        isLoading: false,
        data: [
          { x: 'Aug', y: 4 },
          { x: 'Sep', y: 1 },
          { x: 'Oct', y: 8 },
          { x: 'Nov', y: 4 },
        ],
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      votes: {
        isLoading: false,
        data: [{ asset: { votes: [{ delegateAddress: '1L', amount: '100000000' }] } }],
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      votedDelegates: {
        isLoading: false,
        data: [{ address: '1L', username: 'test_del' }],
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      filters: {
        tab: 'active',
      },
      applyFilters: jest.fn(filters => wrapper.setProps({ filters })),
      networkStatus: {
        data: {
          supply: 13963011200000000,
        },
      },
    };
  });

  it('renders a page with header', () => {
    wrapper = setup(props);
    expect(wrapper.find('BoxHeader.delegates-table')).toIncludeText('Inside round');
  });

  it('allows to switch to standby delegates', () => {
    wrapper = setup(props);
    switchTab('standby');
    expect(wrapper.find('.tab.standby')).toHaveClassName('active');
  });

  it('renders the forging status', () => {
    wrapper = setup(props);
    expect(wrapper.find('a.delegate-row')).toHaveLength(delegatesList.length + 1);
  });
});
