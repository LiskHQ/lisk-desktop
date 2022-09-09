import React from 'react';
import { useSelector } from 'react-redux';
import { mountWithProps, mountWithRouter, mountWithRouterAndStore } from 'src/utils/testHelpers';
import RecentTransactions, { NoTransactions, NotSignedIn } from './RecentTransactions';

const t = (str) => str;
const transactionError = { error: { code: 404 } };

const LiskTransactions = {
  data: [
    {
      id: 0,
      amount: '0.001',
      token: 'LSK',
      type: 0,
      moduleCommandID: '2:0',
      sender: {
        address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
      },
      params: {
        recipient: {
          address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
        },
        votes: [],
      },
    },
    {
      id: 2,
      amount: '0.008',
      token: 'LSK',
      type: 1,
      moduleCommandID: '5:0',
      sender: {
        address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
      },
      params: {
        recipient: {
          address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
        },
        votes: [],
      },
    },
    {
      id: 3,
      amount: '0.0009',
      token: 'LSK',
      type: 2,
      moduleCommandID: '4:0',
      sender: {
        address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
      },
      params: {
        recipient: {
          address: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
        },
        votes: [],
      },
    },
    {
      id: 4,
      amount: '25',
      token: 'LSK',
      type: 3,
      moduleCommandID: '5:1',
      sender: {
        address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
      },
      params: {
        recipient: {
          address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
        },
        votes: [],
      },
    },
  ],
  isLoading: false,
  meta: { count: 10 },
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

const NotSignedInState = {
  account: {},
  settings: {
    token: {
      active: 'LSK',
    },
  },
  bookmarks,
};

const mockUseContext = (mockData = {}) => {
  jest.spyOn(React, 'useContext').mockImplementation(() => ({
    ...mockData,
  }));
};

useSelector.mockReturnValue({ ...LiskState.account, ...LiskState.settings });

describe('Recent Transactions', () => {
  it('Should render Recent Transactions properly with LSK active token', () => {
    mockUseContext({
      currentBlockHeight: 100000,
      data: LiskTransactions.data[0],
      activeToken: 'LSK',
      avatarSize: 40,
    });

    const wrapper = mountWithRouterAndStore(
      RecentTransactions,
      { t, transactions: LiskTransactions },
      {},
      LiskState
    );
    expect(wrapper.find('TransactionRow')).toHaveLength(LiskTransactions.data.length);
  });

  it('Should render Recent Transactions with empty state', () => {
    const wrapper = mountWithProps(RecentTransactions, { t, transactions: noTx }, LiskState);
    expect(wrapper).not.toContainMatchingElement('TransactionRow');
    expect(wrapper).toContainMatchingElement(NoTransactions);
  });

  it('Should render sign in message if the user is not signed in', () => {
    useSelector.mockClear();
    useSelector.mockReturnValue({
      ...LiskState.account,
      ...LiskState.settings,
      passphrase: undefined,
    });
    const wrapper = mountWithRouter(
      RecentTransactions,
      { t, transactions: noTx },
      NotSignedInState
    );
    expect(wrapper).not.toContainMatchingElement('.transactions-row');
    expect(wrapper).toContainMatchingElement(NotSignedIn);
  });
});
