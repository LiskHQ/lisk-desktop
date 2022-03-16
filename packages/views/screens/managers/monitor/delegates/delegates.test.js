import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import fakeStore from '../../../../../test/unit-test-utils/fakeStore';
import Delegates from './delegates';
import delegatesList from '../../../../../test/constants/delegates';
import accounts from '../../../../../test/constants/accounts';

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
  account: accounts.genesis,
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

  function initSanctionedProps() {
    props.sanctionedDelegates = {
      isLoading: false,
      data: [
        {
          address: 'lsktaa9xuys6hztyaryvx6msu279mpkn9sz6w5or2',
          consecutiveMissedBlocks: 220,
          isBanned: true,
          lastForgedHeight: 16695471,
          producedBlocks: 1404,
          rank: 1563,
          registrationHeight: 16331164,
          rewards: '140200000000',
          status: 'banned',
          totalVotesReceived: '2170000000000',
          username: 'ziqi',
          voteWeight: '0',
        },
        {
          address: 'lsksaca4v9r3uotdzdhje3smwa49rvj2h2sn5yskt',
          consecutiveMissedBlocks: 0,
          isBanned: false,
          lastForgedHeight: 16784595,
          producedBlocks: 4929,
          rank: 1503,
          registrationHeight: 16270293,
          rewards: '491800000000',
          status: 'punished',
          totalVotesReceived: '8771000000000',
          username: 'liskjp',
          voteWeight: '0',
        },
        {
          address: 'lskr39gqjxhepd9o5txgmups9zjhjaadfjgm5dc87',
          consecutiveMissedBlocks: 229,
          isBanned: true,
          lastForgedHeight: 16739690,
          producedBlocks: 2014,
          rank: 1436,
          registrationHeight: 16270293,
          rewards: '201125000000',
          status: 'banned',
          totalVotesReceived: '2356000000000',
          username: 'acheng',
          voteWeight: '0',
        },
      ],
      loadData: jest.fn(),
      clearData: jest.fn(),
      urlSearchParams: {},
    };
  }

  const { blocks } = store.getState();

  beforeEach(() => {
    props = {
      t: key => key,
      blocks,
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
      delegatesCount: {
        isLoading: false,
        data: '589',
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      transactionsCount: {
        isLoading: false,
        data: '12345678',
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      registrations: {
        isLoading: false,
        data: [
          ['2020-8', 576],
          ['2020-9', 577],
          ['2020-10', 585],
          ['2020-11', 589],
        ],
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      votes: {
        isLoading: false,
        data: [{ asset: { votes: [{ delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11', amount: '100000000' }] } }],
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      votedDelegates: {
        isLoading: false,
        data: [{ address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11', username: 'test_del' }],
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
    expect(wrapper.find('a.delegate-row')).toHaveLength(blocks.forgers.length);
  });

  it('properly sorts delegates by their status', () => {
    initSanctionedProps();
    wrapper = setup(props);
    switchTab('sanctioned');

    const sortByBtn = wrapper.find('span.sort-by');
    const statuses = wrapper.find('a.delegate-row > span:first-child ~ span ~ span > span').map(ele => ele.text());
    statuses.forEach((status, index) => {
      expect(status).equal(index === 1 ? 'Punished' : 'Banned');
    });

    sortByBtn.last().simulate('click');

    statuses.forEach((status, index) => {
      expect(status).equal(index === 2 ? 'Banned' : 'Punished');
    });

    wrapper.find('span.sort-by').at(1).simulate('click');
    statuses.forEach((status, index) => {
      expect(status).equal(index === 2 ? 'Punished' : 'Banned');
    });
  });
});
