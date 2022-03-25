import { act } from 'react-dom/test-utils';
import networks from '@network/configuration/networks';
import { tokenMap } from '@token/configuration/tokens';
import { mountWithProps } from '@common/utilities/testHelpers';
import * as hwManagerAPI from '@hardwareWallet/utilities/hwManager';
import { create } from '@transaction/utilities/api';
import useTransactionPriority from '@shared/transactionPriority/useTransactionPriority';
import useTransactionFeeCalculation from '@shared/transactionPriority/useTransactionFeeCalculation';
import LockedBalance from './index';
import accounts from '../../../../../../tests/constants/accounts';
import flushPromises from '../../../../../../tests/unit-test-utils/flushPromises';

jest.mock('@shared/transactionPriority/useTransactionPriority');
jest.mock('@shared/transactionPriority/useTransactionFeeCalculation');
jest.mock('@transaction/utilities/api');
jest.mock('@common/store/actions/account', () => ({
  balanceUnlocked: jest.fn(),
}));
jest.mock('@hardwareWallet/utilities/hwManager');

describe('Unlock LSK modal', () => {
  let wrapper;
  useTransactionPriority.mockImplementation(() => (
    [
      { selectedIndex: 1 },
      () => { },
      [
        { title: 'Low', value: 0.001 },
        { title: 'Medium', value: 0.005 },
        { title: 'High', value: 0.01 },
        { title: 'Custom', value: undefined },
      ],
    ]
  ));
  useTransactionFeeCalculation.mockImplementation(() => ({
    fee: { value: '0.1' },
    maxAmount: 0.1,
    minFee: 0.001,
  }));

  const nextStep = jest.fn();

  const props = {
    prevState: {},
    nextStep,
  };

  const currentBlockHeight = 5000;
  const initVotes = [
    { amount: '500000000000', delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
    { amount: '3000000000', delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13' },
    { amount: '2000000000', delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
  ];
  const initUnlocking = [
    { amount: '1000000000', height: { start: 4900, end: 5900 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
    { amount: '3000000000', height: { start: 100, end: 200 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
    { amount: '1000000000', height: { start: 3000, end: 4000 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13' },
  ];

  const store = {
    account: {
      ...accounts.genesis,
      info: {
        LSK: {
          ...accounts.genesis,
          dpos: {
            unlocking: initUnlocking,
            sentVotes: initVotes,
          },
          sequence: { nonce: '178' },
        },
      },
    },
    settings: {
      token: {
        active: tokenMap.LSK.key,
      },
    },
    blocks: {
      latestBlocks: [{ height: currentBlockHeight }],
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

  beforeEach(() => {
    wrapper = mountWithProps(LockedBalance, props, store);
    hwManagerAPI.signTransactionByHW.mockResolvedValue({});
  });

  it('renders the LockedBalance component properly', () => {
    expect(wrapper).toContainMatchingElement('.lock-balance-amount-container');
    expect(wrapper).toContainMatchingElement('.transaction-priority');
    expect(wrapper).toContainMatchingElement('.unlock-btn');
  });

  it('fires balanceUnlocked action with selected fee', async () => {
    const tx = { id: 1 };
    create.mockImplementation(() =>
      new Promise((resolve) => {
        resolve(tx);
      }));

    // Act
    wrapper.find('.unlock-btn').at(0).simulate('click');
    act(() => { wrapper.update(); });
    await flushPromises();
    expect(props.nextStep).toBeCalledWith({
      rawTransaction: {
        selectedFee: '0.1',
      },
    });
  });
});
