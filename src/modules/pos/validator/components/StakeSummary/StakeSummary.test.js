import { mountWithRouter } from 'src/utils/testHelpers';
import { useAuth } from '@auth/hooks/queries';
import { mockAuth } from 'src/modules/auth/__fixtures__';
import accounts from '@tests/constants/wallets';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import usePosToken from '@pos/validator/hooks/usePosToken';
import Summary from './StakeSummary';

const mockedCurrentAccount = mockSavedAccounts[0];

jest.mock('@auth/hooks/queries');
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));
jest.mock('@pos/validator/hooks/usePosToken');

const added = {
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11: {
    confirmed: 0,
    unconfirmed: 10,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12: {
    confirmed: 0,
    unconfirmed: 20,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13: {
    confirmed: 0,
    unconfirmed: 30,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y44: {
    confirmed: 0,
    unconfirmed: 40,
  },
};

const removed = {
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y21: {
    confirmed: 10,
    unconfirmed: 0,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y22: {
    confirmed: 20,
    unconfirmed: 0,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y23: {
    confirmed: 30,
    unconfirmed: 0,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y24: {
    confirmed: 40,
    unconfirmed: 0,
  },
};

const edited = {
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y31: {
    confirmed: 10,
    unconfirmed: 20,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y32: {
    confirmed: 20,
    unconfirmed: 30,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y33: {
    confirmed: 30,
    unconfirmed: 10,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y34: {
    confirmed: 40,
    unconfirmed: 20,
  },
};

const transactionJSON = {
  senderPublickKey: accounts.genesis.summary.publicKey,
  nonce: accounts.genesis.sequence.nonce,
  fee: '1000000',
  signatures: [],
  module: 'pos',
  command: 'stakeValidator',
  params: {
    stakes: [
      {
        amount: '100',
        validatorAddress: accounts.genesis.summary.address,
      },
      {
        amount: '-100',
        validatorAddress: accounts.validator.summary.address,
      },
    ],
  },
};

const transaction = { id: 1 };

const props = {
  transactionJSON,
  t: (s) => s,
  account: accounts.genesis,
  stakesSubmitted: jest.fn(),
  nextStep: jest.fn(),
  transactions: { txSignatureError: null, signedTransaction: transaction },
  normalizedStakes: { lsk123: {} },
  selectedPriority: { title: 'Normal', value: 1 },
  formProps: {
    isValid: true,
    moduleCommand: 'pos:stake',
    composedFees: [
      {
        title: 'Transaction',
        value: '0 LSK',
        components: [],
      },
      {
        title: 'Message',
        value: '0 LSK',
        isHidden: true,
        components: [],
      },
    ],
    rewards: {
      lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11: { amount: 100000 },
      lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y31: { amount: 200000 },
      lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y22: { amount: 300000 },
      total: 600000,
    },
  },
};

beforeEach(() => {
  props.stakesSubmitted.mockClear();
  props.nextStep.mockClear();
});

describe('StakingQueue.Summary', () => {
  useAuth.mockReturnValue({ data: mockAuth });
  usePosToken.mockReturnValue({ token: mockAppsTokens.data[0] });

  it('renders properly', () => {
    const wrapper = mountWithRouter(Summary, props);

    expect(wrapper).toContainMatchingElement('StakeStats');
  });

  it('renders properly when only new stakes are present', () => {
    const wrapper = mountWithRouter(Summary, {
      ...props,
      added,
    });

    expect(wrapper).toContainMatchingElements(4, '.stake-item-address');
  });

  it('renders properly when only removed stakes are present', () => {
    const wrapper = mountWithRouter(Summary, {
      ...props,
      removed,
    });

    expect(wrapper).toContainMatchingElements(4, '.stake-item-address');
  });

  it('renders properly when only edited stakes are present', () => {
    const wrapper = mountWithRouter(Summary, {
      ...props,
      edited,
    });

    expect(wrapper).toContainMatchingElements(4, '.stake-item-address');
  });

  it('renders properly when a mixture of stakes are present', () => {
    const wrapper = mountWithRouter(Summary, {
      ...props,
      edited,
      removed,
      added,
    });

    expect(wrapper).toContainMatchingElements(12, '.stake-item-address');
  });

  it('should render rewards', () => {
    const wrapper = mountWithRouter(Summary, { ...props, edited, removed, added });
    const addedItemList = wrapper.find('.stake-item').at(0);
    const editedItemList = wrapper.find('.stake-item').at(4);
    const removedItemList = wrapper.find('.stake-item').at(9);
    expect(addedItemList).toHaveText(
      'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y110 LSKReward:  0.001 LSK'
    );
    expect(editedItemList).toHaveText(
      'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y310.0000001 LSK0.0000002 LSKReward:  0.002 LSK'
    );
    expect(removedItemList).toHaveText(
      'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y220.0000002 LSKReward:  0.003 LSK'
    );
  });

  it('calls props.nextStep with properties when confirm button is clicked', () => {
    const wrapper = mountWithRouter(Summary, props);
    wrapper.find('button.confirm-button').simulate('click');

    expect(props.nextStep).toHaveBeenCalledWith({
      transactionJSON,
      formProps: props.formProps,
      actionFunction: props.stakesSubmitted,
      statusInfo: {
        locked: 0n,
        unlockable: 0n,
        selfUnstake: {},
      },
    });
  });

  it('calls props.nextStep when transaction is confirmed', () => {
    const wrapper = mountWithRouter(Summary, {
      ...props,
      added,
      removed,
      edited,
    });

    wrapper.find('button.confirm-button').simulate('click');
    expect(props.nextStep).toHaveBeenCalledTimes(1);
    expect(props.nextStep).toHaveBeenCalledWith({
      transactionJSON,
      formProps: props.formProps,
      actionFunction: props.stakesSubmitted,
      statusInfo: {
        locked: 100n,
        unlockable: 120n,
        selfUnstake: {},
      },
    });
  });
});
