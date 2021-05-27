import { mountWithRouterAndStore } from '@utils/testHelpers';
import accounts from '../../../../../test/constants/accounts';
import Summary from './summary';

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

const store = {
  account: {
    passphrase: 'test',
    info: {
      LSK: accounts.genesis,
    },
  },
  settings: {
    token: {
      active: 'LSK',
    },
  },
};

const props = {
  t: s => s,
  account: accounts.genesis,
  votesSubmitted: jest.fn(),
  nextStep: jest.fn(),
  prevStep: jest.fn(),
  transactions: { transactionsCreatedFailed: [], transactionsCreated: [] },
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('VotingQueue.Summary', () => {
  it('renders properly', () => {
    const wrapper = mountWithRouterAndStore(Summary, props, {}, store);

    expect(wrapper).toContainMatchingElement('VoteStats');
    expect(wrapper).toContainMatchingElement('.fee');
    expect(wrapper).toContainMatchingElement('.total-votes');
    expect(wrapper).toContainMatchingElement('.confirm-button');
    expect(wrapper).toContainMatchingElement('.cancel-button');
  });

  it('renders properly when only new votes are present', () => {
    const wrapper = mountWithRouterAndStore(Summary, {
      ...props, added,
    }, {}, store);

    expect(wrapper).toContainMatchingElements(4, '.vote-item-address');
  });

  it('renders properly when only removed votes are present', () => {
    const wrapper = mountWithRouterAndStore(Summary, {
      ...props, removed,
    }, {}, store);

    expect(wrapper).toContainMatchingElements(4, '.vote-item-address');
  });

  it('renders properly when only edited votes are present', () => {
    const wrapper = mountWithRouterAndStore(Summary, {
      ...props, edited,
    }, {}, store);

    expect(wrapper).toContainMatchingElements(4, '.vote-item-address');
  });

  it('renders properly when a mixture of votes is present', () => {
    const wrapper = mountWithRouterAndStore(Summary, {
      ...props, edited, removed, added,
    }, {}, store);

    expect(wrapper).toContainMatchingElements(12, '.vote-item-address');
  });

  it('calls props.votesSubmitted when confirm button is clicked', () => {
    const wrapper = mountWithRouterAndStore(Summary, props, {}, store);
    wrapper.find('button.confirm-button').simulate('click');

    expect(props.votesSubmitted).toHaveBeenCalledTimes(2);
  });

  it('calls props.nextStep when transaction is confirmed', () => {
    mountWithRouterAndStore(Summary, {
      ...props,
      added,
      removed,
      edited,
      transactions: { transactionsCreated: [{}], transactionsCreatedFailed: [] },
    }, {}, store);

    expect(props.nextStep).toHaveBeenCalledTimes(1);
    expect(props.nextStep).toHaveBeenCalledWith(expect.objectContaining({ error: false }));
  });

  it('calls props.nextStep when transaction create fail', () => {
    mountWithRouterAndStore(Summary, {
      ...props,
      transactions: { transactionsCreated: [], transactionsCreatedFailed: [{}] },
    }, {}, store);

    expect(props.nextStep).toHaveBeenCalledTimes(1);
    expect(props.nextStep).toHaveBeenCalledWith(expect.objectContaining({ error: true }));
  });
});
