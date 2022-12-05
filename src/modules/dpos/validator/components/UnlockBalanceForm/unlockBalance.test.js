import { act } from 'react-dom/test-utils';
import networks from '@network/configuration/networks';
import { tokenMap } from '@token/fungible/consts/tokens';
import { mountWithQueryAndProps } from 'src/utils/testHelpers';
import * as hwManager from '@transaction/utils/hwManager';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { mockBlocks } from '@block/__fixtures__';
import { signTransaction } from '@transaction/api';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import useTransactionFeeCalculation from '@transaction/hooks/useTransactionFeeCalculation';
import wallets from '@tests/constants/wallets';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import UnlockBalanceForm from './index';

jest.mock('@account/hooks/useDeprecatedAccount', () => ({
  useDeprecatedAccount: jest.fn().mockReturnValue({
    isSuccess: true,
    isLoading: false,
  }),
}));
jest.mock('@transaction/hooks/useTransactionPriority');
jest.mock('@block/hooks/queries/useLatestBlock');
jest.mock('@transaction/hooks/useTransactionFeeCalculation');
jest.mock('@transaction/api');
jest.mock('@dpos/validator/store/actions/voting', () => ({
  balanceUnlocked: jest.fn(),
}));
jest.mock('@transaction/utils/hwManager');

describe('Unlock LSK modal', () => {
  let wrapper;
  useTransactionPriority.mockImplementation(() => [
    { selectedIndex: 1 },
    () => {},
    [
      { title: 'Low', value: 0.001 },
      { title: 'Medium', value: 0.005 },
      { title: 'High', value: 0.01 },
      { title: 'Custom', value: undefined },
    ],
  ]);
  useTransactionFeeCalculation.mockImplementation(() => ({
    fee: { value: '0.1' },
    maxAmount: 0.1,
    minFee: 0.001,
  }));
  useLatestBlock.mockReturnValue({ data: mockBlocks.data[0] });

  const nextStep = jest.fn();

  const props = {
    prevState: {},
    nextStep,
  };

  const initVotes = [
    { amount: '500000000000', delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
    { amount: '3000000000', delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13' },
    { amount: '2000000000', delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
  ];
  const initUnlocking = [
    {
      amount: '1000000000',
      height: { start: 4900, end: 5900 },
      delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
    },
    {
      amount: '3000000000',
      height: { start: 100, end: 200 },
      delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
    },
    {
      amount: '1000000000',
      height: { start: 3000, end: 4000 },
      delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13',
    },
  ];

  const store = {
    wallet: {
      ...wallets.genesis,
      info: {
        LSK: {
          ...wallets.genesis,
          dpos: {
            unlocking: initUnlocking,
            sentVotes: initVotes,
          },
          sequence: { nonce: '178' },
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
  const transactionJSON = {
    module: 'dpos',
    command: 'unlock',
    nonce: '178',
    fee: 10000000,
    senderPublicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
    params: {
      unlockObjects: [
        {
          delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
          amount: '1000000000',
          unvoteHeight: 4900,
        },
        {
          delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
          amount: '3000000000',
          unvoteHeight: 100,
        },
        {
          delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13',
          amount: '1000000000',
          unvoteHeight: 3000,
        },
      ],
    },
    signatures: [],
  };

  beforeEach(() => {
    wrapper = mountWithQueryAndProps(UnlockBalanceForm, props, store);
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
    signTransaction.mockImplementation(
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
        composedFees: {
          Transaction: '0.1 LSK',
          Initialisation: '0.1 LSK',
        },
        isValid: true,
        moduleCommand: 'dpos:unlock',
      },
      fees: undefined,
      selectedPriority: { selectedIndex: 1 },
    });
  });

  it('calls nextStep when clicked on confirm', async () => {
    wrapper.find('.confirm-btn button').simulate('click');
    expect(props.nextStep).toBeCalledWith(
      expect.objectContaining({
        transactionJSON,
        formProps: {
          composedFees: {
            Transaction: '0.1 LSK',
            Initialisation: '0.1 LSK',
          },
          isValid: true,
          moduleCommand: 'dpos:unlock',
        },
        fees: undefined,
        selectedPriority: { selectedIndex: 1 },
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
            dpos: {
              unlocking: [],
              sentVotes: [],
            },
          },
        },
      },
    };
    wrapper = mountWithQueryAndProps(UnlockBalanceForm, props, newStore);
    wrapper.find('.confirm-btn button').simulate('click');
    expect(props.nextStep).not.toBeCalled();
  });
});
