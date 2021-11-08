import { mountWithProps, mountWithRouter, mountWithRouterAndStore } from '@utils/testHelpers';
import RecentTransactions, { NoTransactions, NotSignedIn } from './recentTransactions';

const t = str => str;
const transactionError = { error: { code: 404 } };

const LiskTransactions = {
  data: [
    {
      id: 0,
      amount: '0.001',
      token: 'LSK',
      type: 0,
      moduleAssetId: '2:0',
      sender: {
        address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
      },
      asset: {
        recipient: {
          address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
        },
      },
    },
    {
      id: 2,
      amount: '0.008',
      token: 'LSK',
      type: 1,
      moduleAssetId: '5:0',
      sender: {
        address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
      },
      asset: {
        recipient: {
          address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
        },
      },
    },
    {
      id: 3,
      amount: '0.0009',
      token: 'LSK',
      type: 2,
      moduleAssetId: '4:0',
      sender: {
        address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
      },
      asset: {
        recipient: {
          address: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
        },
      },
    },
    {
      id: 4,
      amount: '25',
      token: 'LSK',
      type: 3,
      moduleAssetId: '5:1',
      sender: {
        address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
      },
      asset: {
        recipient: {
          address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
        },
      },
    },
  ],
  isLoading: false,
  meta: { count: 10 },
  loadData: jest.fn(),
  ...transactionError,
};

const BitcoinTransactions = {
  data: [
    {
      id: 0,
      amount: '0.001',
      token: 'BTC',
      type: 0,
      moduleAssetId: '2:0',
      sender: {
        address: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
      },
      asset: {
        recipient: {
          address: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
        },
      },
    },
    {
      id: 1,
      amount: '0.0003',
      token: 'BTC',
      type: 0,
      moduleAssetId: '2:0',
      sender: {
        address: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
      },
      asset: {
        recipient: {
          address: 'mkakDp2f31b3eXdATtAggoqwXcdx1PqqFo',
        },
      },
    },
  ],
  isLoading: false,
  meta: { count: 2 },
  loadData: jest.fn(),
  ...transactionError,
};

const noTx = {
  data: [],
  isLoading: false,
  meta: { count: 0 },
  loadData: jest.fn(),
  ...transactionError,
};

const bookmarks = {
  LSK: [
    {
      id: 0,
      address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
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
      LSK: { summary: { address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6' } },
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
      BTC: { summary: { address: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo' } },
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
    const { wrapper } = mountWithRouterAndStore(
      RecentTransactions,
      { t, transactions: LiskTransactions },
      {},
      LiskState,
    );
    expect(wrapper.find('TransactionRow')).toHaveLength(LiskTransactions.data.length);
  });

  it('Should render Recent Transactions properly with BTC active token', () => {
    const { wrapper } = mountWithRouterAndStore(
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
