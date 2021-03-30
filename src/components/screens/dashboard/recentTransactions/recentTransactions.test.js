import { mountWithProps, mountWithRouter, mountWithRouterAndStore } from '@utils/testHelpers';
import RecentTransactions, { NoTransactions, NotSignedIn } from './recentTransactions';

const t = str => str;

const LiskTransactions = {
  data: [
    {
      id: 0,
      recipientId: '123456L',
      senderId: '123456L',
      amount: '0.001',
      token: 'LSK',
      type: 0,
      moduleAssetId: '2:0',
    },
    {
      id: 2,
      recipientId: '123456L',
      senderId: '123456L',
      amount: '0.008',
      token: 'LSK',
      type: 1,
      moduleAssetId: '5:0',
    },
    {
      id: 3,
      recipientId: '234234234L',
      senderId: '123456L',
      amount: '0.0009',
      token: 'LSK',
      type: 2,
      moduleAssetId: '4:0',
    },
    {
      id: 4,
      recipientId: '4564346346L',
      senderId: '123456L',
      amount: '25',
      token: 'LSK',
      type: 3,
      moduleAssetId: '5:1',
    },
  ],
  isLoading: false,
  meta: { count: 10 },
  loadData: jest.fn(),
};

const BitcoinTransactions = {
  data: [
    {
      id: 0,
      recipientId: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
      senderId: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
      amount: '0.001',
      token: 'BTC',
      type: 0,
      moduleAssetId: '2:0',
    },
    {
      id: 1,
      recipientId: 'mkakDp2f31b3eXdATtAggoqwXcdx1PqqFo',
      senderId: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
      amount: '0.0003',
      token: 'BTC',
      type: 0,
      moduleAssetId: '2:0',
    },
  ],
  isLoading: false,
  meta: { count: 2 },
  loadData: jest.fn(),
};

const noTx = {
  data: [],
  isLoading: false,
  meta: { count: 0 },
  loadData: jest.fn(),
};

const bookmarks = {
  LSK: [
    {
      id: 0,
      address: '2435345L',
      title: 'saved account',
      amount: '0.001',
      type: 0,
    },
  ],
  BTC: [
    {
      id: 0,
      address: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
      title: 'saved account',
      amount: '0.001',
      type: 0,
    },
  ],
};

const LiskState = {
  account: {
    passphrase: 'test',
    info: {
      LSK: { address: '12345L' },
    },
  },
  settings: {
    token: {
      active: 'LSK',
    },
  },
  bookmarks,
};

const BitcoinState = {
  account: {
    passphrase: 'test',
    info: {
      BTC: { address: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo' },
    },
  },
  settings: {
    token: {
      active: 'BTC',
    },
  },
  bookmarks,
};

const NotSignedInState = {
  account: {},
  settings: {
    token: {
      active: 'LSK',
    },
  },
  bookmarks,
};

describe('Recent Transactions', () => {
  it('Should render Recent Transactions properly with LSK active token', () => {
    const wrapper = mountWithRouterAndStore(
      RecentTransactions,
      { t, transactions: LiskTransactions },
      {},
      LiskState,
    );
    expect(wrapper.find('TransactionRow')).toHaveLength(LiskTransactions.data.length);
  });

  it('Should render Recent Transactions properly with BTC active token', () => {
    const wrapper = mountWithRouterAndStore(
      RecentTransactions,
      { t, transactions: BitcoinTransactions },
      {},
      BitcoinState,
    );
    expect(wrapper.find('TransactionRow')).toHaveLength(BitcoinTransactions.data.length);
  });

  it('Should render Recent Transactions with empty state', () => {
    const wrapper = mountWithProps(
      RecentTransactions,
      { t, transactions: noTx },
      LiskState,
    );
    expect(wrapper).not.toContainMatchingElement('TransactionRow');
    expect(wrapper).toContainMatchingElement(NoTransactions);
  });

  it('Should render sign in message if the user is not signed in', () => {
    const wrapper = mountWithRouter(
      RecentTransactions,
      { t, transactions: noTx },
      NotSignedInState,
    );
    expect(wrapper).not.toContainMatchingElement('.transactions-row');
    expect(wrapper).toContainMatchingElement(NotSignedIn);
  });
});
