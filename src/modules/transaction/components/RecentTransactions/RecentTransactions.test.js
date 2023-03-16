import React from 'react';
import { useSelector } from 'react-redux';
import { cryptography } from '@liskhq/lisk-client';
import accounts from '@tests/constants/wallets';
import { mockBlocks } from '@block/__fixtures__';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { useCurrentAccount } from '@account/hooks';
import { mountWithProps, mountWithRouter, mountWithRouterAndStore } from 'src/utils/testHelpers';
import RecentTransactions, { NoTransactions, NotSignedIn } from './RecentTransactions';
import { useTransactions } from '../../hooks/queries';

const t = (str) => str;
const transactionError = { error: { code: 404 } };
const LiskTransactions = {
  data: [
    {
      id: 0,
      amount: '0.001',
      token: 'LSK',
      type: 0,
      moduleCommand: 'token:transfer',
      senderPublicKey: accounts.genesis.summary.publicKey,
      sender: { address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6' },
      params: {
        recipient: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
        stakes: [],
      },
      meta: {
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
      moduleCommand: 'pos:registerValidator',
      senderPublicKey: accounts.genesis.summary.publicKey,
      sender: { address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6' },
      params: {
        recipientAddress: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
        stakes: [],
      },
    },
    {
      id: 3,
      amount: '0.0009',
      token: 'LSK',
      type: 2,
      moduleCommand: 'auth:registerMultisignature',
      sender: { address: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy' },
      senderPublicKey: accounts.genesis.summary.publicKey,
      params: {
        recipientAddress: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
        stakes: [],
      },
    },
    {
      id: 4,
      amount: '25',
      token: 'LSK',
      type: 3,
      moduleCommand: 'pos:stake',
      senderPublicKey: accounts.genesis.summary.publicKey,
      sender: { address: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy' },
      params: {
        recipientAddress: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
        stakes: [],
      },
    },
  ],
  isLoading: false,
  meta: { count: 10 },
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
jest.mock('@account/hooks');
jest.mock('@transaction/hooks/queries');
jest.mock('@block/hooks/queries/useLatestBlock');
jest
  .spyOn(cryptography.address, 'getLisk32AddressFromPublicKey')
  .mockReturnValue('lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6');
jest.mock('@token/fungible/hooks/queries');

useTokensBalance.mockReturnValue({ data: mockAppsTokens.data[0] });
useSelector.mockReturnValue({ ...LiskState.account, ...LiskState.settings });
useLatestBlock.mockReturnValue({ data: mockBlocks.data[0] });

describe('Recent Transactions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render Recent Transactions properly with LSK active token', () => {
    mockUseContext({
      currentBlockHeight: 100000,
      data: LiskTransactions.data[0],
      activeToken: 'LSK',
      avatarSize: 40,
    });
    useCurrentAccount.mockReturnValue([
      {
        metadata: {
          address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
        },
      },
    ]);
    useTransactions.mockReturnValue({
      data: LiskTransactions,
      isLoading: false,
      hasNextPage: false,
      isFetching: false,
    });

    const wrapper = mountWithRouterAndStore(RecentTransactions, { t }, {}, LiskState);
    expect(wrapper.find('TransactionRow')).toHaveLength(LiskTransactions.data.length);
  });

  it('Should render Recent Transactions with empty state', () => {
    useCurrentAccount.mockReturnValue([
      {
        metadata: {
          address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
        },
      },
    ]);
    useTransactions.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      hasNextPage: false,
      isFetching: false,
    });
    const wrapper = mountWithProps(RecentTransactions, { t }, LiskState);
    expect(wrapper).not.toContainMatchingElement('TransactionRow');
    expect(wrapper).toContainMatchingElement(NoTransactions);
  });

  it('Should render sign in message if the user is not signed in', () => {
    useCurrentAccount.mockReturnValue([]);
    useTransactions.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      hasNextPage: false,
      isFetching: false,
    });
    const wrapper = mountWithRouter(RecentTransactions, { t }, NotSignedInState);
    expect(wrapper).not.toContainMatchingElement('.transactions-row');
    expect(wrapper).toContainMatchingElement(NotSignedIn);
  });
});
