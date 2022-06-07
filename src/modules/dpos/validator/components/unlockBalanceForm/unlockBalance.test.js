import { act } from 'react-dom/test-utils';
import networks from '@network/configuration/networks';
import { tokenMap } from '@token/fungible/consts/tokens';
import { mountWithProps } from 'src/utils/testHelpers';
import * as hwManager from '@transaction/utils/hwManager';
import { create } from '@transaction/api';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import useTransactionFeeCalculation from '@transaction/hooks/useTransactionFeeCalculation';
import wallets from '@tests/constants/wallets';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import LockedBalance from './index';

jest.mock('@transaction/hooks/useTransactionPriority');
jest.mock('@transaction/hooks/useTransactionFeeCalculation');
jest.mock('@transaction/api');
jest.mock('@dpos/validator/store/actions/voting', () => ({
  balanceUnlocked: jest.fn(),
}));
jest.mock('@transaction/utils/hwManager');

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
    settings: {
    },
    token: {
      active: tokenMap.LSK.key,
      list: { LSK: true },
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
    hwManager.signTransactionByHW.mockResolvedValue({});
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

  it('calls nextStep when clicked on confirm', async () => {
    wrapper.find('.unlock-btn button').simulate('click');
    expect(props.nextStep).toBeCalledWith(
      expect.objectContaining({ rawTransaction: { selectedFee: '100' } }),
    );
  });

  it('does not call nextStep when unlockableBalance is zero', async () => {
    const noUnlockProps = {
      ...props,
      data: {
        ...props.data,
        unlockableBalance: 0,
      },
    };
    wrapper.setProps(noUnlockProps);
    wrapper.find('.unlock-btn button').simulate('click');
    expect(props.nextStep).not.toBeCalled();
  });
});
