import { mountWithRouter } from '../../../../utils/testHelpers';
import Summary from './summary';

const added = {
  '1L': {
    confirmed: 0,
    unconfirmed: 10,
  },
  '2L': {
    confirmed: 0,
    unconfirmed: 20,
  },
  '3L': {
    confirmed: 0,
    unconfirmed: 30,
  },
  '4L': {
    confirmed: 0,
    unconfirmed: 40,
  },
};

const removed = {
  '1L': {
    confirmed: 10,
    unconfirmed: 0,
  },
  '2L': {
    confirmed: 20,
    unconfirmed: 0,
  },
  '3L': {
    confirmed: 30,
    unconfirmed: 0,
  },
  '4L': {
    confirmed: 40,
    unconfirmed: 0,
  },
};

const edited = {
  '1L': {
    confirmed: 10,
    unconfirmed: 20,
  },
  '2L': {
    confirmed: 20,
    unconfirmed: 30,
  },
  '3L': {
    confirmed: 30,
    unconfirmed: 10,
  },
  '4L': {
    confirmed: 40,
    unconfirmed: 20,
  },
};

const props = {
  t: s => s,
  account: { passphrase: '', info: { LSK: { publickKey: '' } } },
  votesSubmitted: jest.fn(),
  nextStep: jest.fn(),
  transactions: { transactionsCreatedFailed: [], transactionsCreated: [] },
};

beforeEach(() => {
  props.votesSubmitted.mockClear();
  props.nextStep.mockClear();
});

describe('VotingQueue.Summary', () => {
  it('renders properly', () => {
    const wrapper = mountWithRouter(Summary, props);

    expect(wrapper).toContainMatchingElement('VoteStats');
    expect(wrapper).toContainMatchingElement('.fee');
    expect(wrapper).toContainMatchingElement('.total-votes');
    expect(wrapper).toContainMatchingElement('.confirm-button');
    expect(wrapper).toContainMatchingElement('.edit-button');
  });

  it('renders properly when only new votes are present', () => {
    const wrapper = mountWithRouter(Summary, {
      ...props, added,
    });

    expect(wrapper).toContainMatchingElements(4, '.voteItem');
  });

  it('renders properly when only removed votes are present', () => {
    const wrapper = mountWithRouter(Summary, {
      ...props, removed,
    });

    expect(wrapper).toContainMatchingElements(4, '.voteItem');
  });

  it('renders properly when only edited votes are present', () => {
    const wrapper = mountWithRouter(Summary, {
      ...props, edited,
    });

    expect(wrapper).toContainMatchingElements(4, '.voteItem');
  });

  it('renders properly when a mixture of votes is present', () => {
    const wrapper = mountWithRouter(Summary, {
      ...props, edited, removed, added,
    });

    expect(wrapper).toContainMatchingElements(12, '.voteItem');
  });

  it('calls props.votesSubmitted when confirm button is clicked', () => {
    const wrapper = mountWithRouter(Summary, props);
    wrapper.find('button.confirm-button').simulate('click');

    expect(props.votesSubmitted).toHaveBeenCalledTimes(1);
  });

  it('calls props.nextStep when transaction is confirmed', () => {
    mountWithRouter(Summary, {
      ...props,
      added,
      removed,
      edited,
      transactions: { transactionsCreated: [{}], transactionsCreatedFailed: [] },
    });

    expect(props.nextStep).toHaveBeenCalledTimes(1);
    expect(props.nextStep).toHaveBeenCalledWith(expect.objectContaining({ error: false }));
  });

  it('calls props.nextStep when transaction is confirmed', () => {
    mountWithRouter(Summary, {
      ...props,
      transactions: { transactionsCreatedFailed: [{}] },
    });

    expect(props.nextStep).toHaveBeenCalledTimes(1);
    expect(props.nextStep).toHaveBeenCalledWith(expect.objectContaining({ error: true }));
  });
});
