import { mountWithRouter } from 'src/utils/testHelpers';
import { useAuth } from '@auth/hooks/queries';
import { mockAuth } from 'src/modules/auth/__fixtures__';
import accounts from '@tests/constants/wallets';
import mockSavedAccounts from '@tests/fixtures/accounts';
import Summary from './VoteSummary';

const mockedCurrentAccount = mockSavedAccounts[0];

jest.mock('@auth/hooks/queries');
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

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
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11: {
    confirmed: 10,
    unconfirmed: 0,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12: {
    confirmed: 20,
    unconfirmed: 0,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13: {
    confirmed: 30,
    unconfirmed: 0,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y44: {
    confirmed: 40,
    unconfirmed: 0,
  },
};

const edited = {
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11: {
    confirmed: 10,
    unconfirmed: 20,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12: {
    confirmed: 20,
    unconfirmed: 30,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13: {
    confirmed: 30,
    unconfirmed: 10,
  },
  lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y44: {
    confirmed: 40,
    unconfirmed: 20,
  },
};

const transactionJSON = {
  senderPublickKey: accounts.genesis.summary.publicKey,
  nonce: accounts.genesis.sequence.nonce,
  fee: '1000000',
  signatures: [],
  module: 'dpos',
  command: 'voteDelegate',
  params: {
    votes: [
      {
        amount: '100',
        delegateAddress: accounts.genesis.summary.address,
      },
      {
        amount: '-100',
        delegateAddress: accounts.delegate.summary.address,
      },
    ],
  },
};

const transaction = { id: 1 };

const props = {
  transactionJSON,
  t: (s) => s,
  account: accounts.genesis,
  votesSubmitted: jest.fn(),
  nextStep: jest.fn(),
  transactions: { txSignatureError: null, signedTransaction: transaction },
  normalizedVotes: { lsk123: {} },
  selectedPriority: { title: 'Normal', value: 1 },
  formProps: {
    isValid: true,
    moduleCommand: 'dpos:voteDelegate',
    composedFees: {
      transaction: '1 LSK',
      CCM: '1 LSK',
      initiation: '1 LSK',
    },
  },
};

beforeEach(() => {
  props.votesSubmitted.mockClear();
  props.nextStep.mockClear();
});

describe('VotingQueue.Summary', () => {
  useAuth.mockReturnValue({ data: mockAuth });

  it('renders properly', () => {
    const wrapper = mountWithRouter(Summary, props);

    expect(wrapper).toContainMatchingElement('StakeStats');
    expect(wrapper).toContainMatchingElement('.vote-fees');
  });

  it('renders properly when only new votes are present', () => {
    const wrapper = mountWithRouter(Summary, {
      ...props,
      added,
    });

    expect(wrapper).toContainMatchingElements(4, '.vote-item-address');
  });

  it('renders properly when only removed votes are present', () => {
    const wrapper = mountWithRouter(Summary, {
      ...props,
      removed,
    });

    expect(wrapper).toContainMatchingElements(4, '.vote-item-address');
  });

  it('renders properly when only edited votes are present', () => {
    const wrapper = mountWithRouter(Summary, {
      ...props,
      edited,
    });

    expect(wrapper).toContainMatchingElements(4, '.vote-item-address');
  });

  it('renders properly when a mixture of votes is present', () => {
    const wrapper = mountWithRouter(Summary, {
      ...props,
      edited,
      removed,
      added,
    });

    expect(wrapper).toContainMatchingElements(12, '.vote-item-address');
  });

  it('calls props.nextStep with properties when confirm button is clicked', () => {
    const wrapper = mountWithRouter(Summary, props);
    wrapper.find('button.confirm-button').simulate('click');

    expect(props.nextStep).toHaveBeenCalledWith({
      transactionJSON,
      formProps: props.formProps,
      actionFunction: props.votesSubmitted,
      statusInfo: {
        locked: 0,
        unlockable: 0,
        selfUnvote: {},
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
      actionFunction: props.votesSubmitted,
      statusInfo: {
        locked: 100,
        unlockable: 120,
        selfUnvote: {},
      },
    });
  });
});
