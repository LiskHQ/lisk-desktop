import { act } from 'react-dom/test-utils';
import networks from '@network/configuration/networks';
import { useAuth } from '@auth/hooks/queries';
import { mockAuth } from '@auth/__fixtures__';
import { tokenMap } from '@token/fungible/consts/tokens';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import { smartRender } from 'src/utils/testHelpers';
import * as hwManager from '@transaction/utils/hwManager';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { mockBlocks } from '@block/__fixtures__';
import * as transactionApi from '@transaction/api';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import wallets from '@tests/constants/wallets';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import { mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { useTransactionEstimateFees } from '@transaction/hooks/queries/useTransactionEstimateFees';
import useSettings from '@settings/hooks/useSettings';

import {
  usePosConstants,
  useSentStakes,
  useUnlocks,
  useValidators,
} from '@pos/validator/hooks/queries';
import { getMockValidators, mockSentStakes, mockUnlocks } from '@pos/validator/__fixtures__';
import { useNetworkStatus } from '@network/hooks/queries';
import { mockNetworkStatus } from '@network/__fixtures__';
import UnlockBalanceForm from '.';
import { mockPosConstants } from '../../__fixtures__/mockPosConstants';

const mockToggleSetting = jest.fn();

jest.mock('@account/hooks/useDeprecatedAccount', () => ({
  useDeprecatedAccount: jest.fn().mockReturnValue({
    isSuccess: true,
    isLoading: false,
  }),
}));
jest.mock('@transaction/hooks/useTransactionPriority');
jest.mock('@block/hooks/queries/useLatestBlock');
jest.mock('@transaction/api');
jest.mock('@pos/validator/store/actions/staking', () => ({
  balanceUnlocked: jest.fn(),
}));
jest.mock('@transaction/utils/hwManager');
jest.mock('@token/fungible/hooks/queries');
jest.mock('../../hooks/queries');
jest.mock('@auth/hooks/queries');
jest.mock('@pos/validator/hooks/queries');
jest.mock('@network/hooks/queries/useNetworkStatus');
jest.mock('@transaction/hooks/queries/useTransactionEstimateFees');
jest.mock('@settings/hooks/useSettings');

describe('Unlock LSK modal', () => {
  let wrapper;
  useTransactionPriority.mockImplementation(() => [
    { selectedIndex: 1 },
    () => { },
    [
      { title: 'Low', value: 0.001 },
      { title: 'Medium', value: 0.005 },
      { title: 'High', value: 0.01 },
      { title: 'Custom', value: undefined },
    ],
  ]);

  useLatestBlock.mockReturnValue({ data: mockBlocks.data[0] });
  useTokenBalances.mockReturnValue({ data: mockTokensBalance, isLoading: false });
  usePosConstants.mockReturnValue({ data: mockPosConstants });
  useAuth.mockReturnValue({ data: mockAuth });
  useValidators.mockImplementation(({ config }) => ({
    data: getMockValidators(config.params?.address),
  }));
  useSentStakes.mockReturnValue({ data: mockSentStakes });
  useUnlocks.mockReturnValue({ data: mockUnlocks });
  useNetworkStatus.mockReturnValue({ data: mockNetworkStatus });
  useSettings.mockReturnValue({
    mainChainNetwork: { name: 'devnet' },
    toggleSetting: mockToggleSetting,
  });

  const nextStep = jest.fn();

  const props = {
    prevState: {},
    nextStep,
  };

  const initStakes = [
    { amount: '500000000000', validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
    { amount: '3000000000', validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13' },
    { amount: '2000000000', validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
  ];
  const initUnlocking = [
    {
      amount: '1000000000',
      unstakeHeight: 4900,
      expectedUnlockableHeight: 5900,
      validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
    },
    {
      amount: '3000000000',
      unstakeHeight: 100,
      expectedUnlockableHeight: 200,
      validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
    },
    {
      amount: '1000000000',
      unstakeHeight: 3000,
      expectedUnlockableHeight: 4000,
      validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13',
    },
  ];

  const store = {
    wallet: {
      ...wallets.genesis,
      info: {
        LSK: {
          ...wallets.genesis,
          pos: {
            pendingUnlocks: initUnlocking,
            sentStakes: initStakes,
          },
          sequence: { nonce: '0' },
        },
      },
    },
    settings: {},
    token: {
      active: tokenMap.LSK.key,
      list: { LSK: true },
    },
    network: {
      name: networks.customNode.name,
      networks: {
        LSK: {
          nodeUrl: networks.customNode.address,
          nethash: '23jh4g',
        },
      },
      status: { online: true },
    },
    transactions: {
      signedTransaction: {},
      txSignatureError: null,
    },
  };
  const mockEstimateFeeResponse = {
    data: {
      transaction: {
        fee: {
          tokenID: '0400000000000000',
          minimum: '5104000',
        },
      },
    },
    meta: {
      breakdown: {
        fee: {
          minimum: {
            byteFee: '96000',
            additionalFees: {},
          },
        },
      },
    },
  };

  const transactionJSON = {
    module: 'pos',
    command: 'unlock',
    params: {},
    nonce: '0',
    fee: mockEstimateFeeResponse.data.transaction.fee.minimum,
    senderPublicKey: 'cf434a889d6c7a064e8de61bb01759a76f585e5ff45a78ba8126ca332601f535',
    signatures: [],
  };
  const config = { renderType: 'mount', queryClient: true, store: true, storeInfo: store };

  beforeAll(() => {
    jest.spyOn(transactionApi, 'dryRunTransaction').mockResolvedValue([]);
    useTransactionEstimateFees.mockReturnValue({
      data: mockEstimateFeeResponse,
      isFetching: false,
      isFetched: true,
      error: false,
    });
  });

  beforeEach(() => {
    wrapper = smartRender(UnlockBalanceForm, props, config).wrapper;
    hwManager.signTransactionByHW.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the LockedBalance component properly', () => {
    expect(wrapper).toContainMatchingElement('.lock-balance-amount-container');
    expect(wrapper).toContainMatchingElement('.transaction-priority');
    expect(wrapper).toContainMatchingElement('.confirm-btn');
  });

  it('fires balanceUnlocked action with selected fee', async () => {
    const tx = { id: 1 };
    transactionApi.signTransaction.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(tx);
        })
    );

    // Act
    wrapper.find('.confirm-btn').at(0).simulate('click');
    act(() => {
      wrapper.update();
    });
    await flushPromises();
    expect(props.nextStep).toBeCalledWith({
      transactionJSON,
      formProps: {
        composedFees: [
          {
            title: 'Transaction',
            value: '-',
            components: [{
              type: 'bytesFee',
              value: 96000n,
              feeToken: {
                availableBalance: '1000000000',
                chainName: 'Lisk',
                lockedBalances: [{ amount: '10000000000', moduleID: '5' }],
                symbol: 'LSK',
                tokenID: '0000000100000000',
              },
            }],
          },
          {
            title: 'Message',
            value: '-',
            isHidden: true,
            components: [],
          },
        ],
        isFormValid: true,
        moduleCommand: 'pos:unlock',
        enableMinimumBalanceFeedback: true,
        fields: {
          token: mockTokensBalance.data[0],
        },
        unlockedAmount: 455000000000,
      },
      fees: [
        {
          title: 'Transaction',
          value: '-',
          components: [{
            type: 'bytesFee', value: 96000n, feeToken: {
              availableBalance: '1000000000',
              chainName: 'Lisk',
              lockedBalances: [{ amount: '10000000000', moduleID: '5' }],
              symbol: 'LSK',
              tokenID: '0000000100000000',
            },
          }],
        },
        {
          title: 'Message',
          value: '-',
          isHidden: true,
          components: [],
        },
      ],
      selectedPriority: { selectedIndex: 1 },
    });
  });

  it('calls nextStep when clicked on confirm', async () => {
    wrapper.find('.confirm-btn').at(0).simulate('click');

    await flushPromises();

    expect(props.nextStep).toBeCalledWith(
      expect.objectContaining({
        fees: [
          {
            components: [
              {
                feeToken: {
                  availableBalance: '1000000000',
                  chainName: 'Lisk',
                  lockedBalances: [{ amount: '10000000000', moduleID: '5' }],
                  symbol: 'LSK',
                  tokenID: '0000000100000000',
                },
                type: 'bytesFee',
                value: 96000n,
              },
            ],
            title: 'Transaction',
            value: '-',
          },
          { components: [], isHidden: true, title: 'Message', value: '-' },
        ],
        formProps: {
          composedFees: [
            {
              components: [
                {
                  feeToken: {
                    availableBalance: '1000000000',
                    chainName: 'Lisk',
                    lockedBalances: [{ amount: '10000000000', moduleID: '5' }],
                    symbol: 'LSK',
                    tokenID: '0000000100000000',
                  },
                  type: 'bytesFee',
                  value: 96000n,
                },
              ],
              title: 'Transaction',
              value: '-',
            },
            { components: [], isHidden: true, title: 'Message', value: '-' },
          ],
          enableMinimumBalanceFeedback: true,
          fields: {
            token: {
              availableBalance: '1000000000',
              chainName: 'Lisk',
              lockedBalances: [{ amount: '10000000000', moduleID: '5' }],
              symbol: 'LSK',
              tokenID: '0000000100000000',
            },
          },
          isFormValid: true,
          moduleCommand: 'pos:unlock',
          unlockedAmount: 455000000000,
        },
        selectedPriority: { selectedIndex: 1 },
        transactionJSON: {
          command: 'unlock',
          fee: '5104000',
          module: 'pos',
          nonce: '0',
          params: {},
          senderPublicKey: 'cf434a889d6c7a064e8de61bb01759a76f585e5ff45a78ba8126ca332601f535',
          signatures: [],
        },
      })
    );
  });

  it.skip('does not call nextStep when unlockableBalance is zero', async () => {
    const newStore = {
      wallet: {
        info: {
          LSK: {
            summary: wallets.genesis.summary,
            sequence: wallets.genesis.sequence,
            token: wallets.genesis.token,
            pos: {
              pendingUnlocks: [],
              sentStakes: [],
            },
          },
        },
      },
    };
    const newConfig = { ...config, storeInfo: newStore };
    wrapper = smartRender(UnlockBalanceForm, props, newConfig).wrapper;
    wrapper.find('.confirm-btn button').simulate('click');
    expect(props.nextStep).not.toBeCalled();
  });
});
