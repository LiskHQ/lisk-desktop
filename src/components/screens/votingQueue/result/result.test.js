import { mountWithRouter } from '../../../../utils/testHelpers';
import Result from './result';


const props = {
  t: s => s,
  history: { push: jest.fn() },
  transactions: { transactionsCreatedFailed: [], transactionsCreated: [{}] },
  transactionBroadcasted: jest.fn(),
};

beforeEach(() => {
  props.transactionBroadcasted.mockClear();
});

describe('VotingQueue.Resuly', () => {
  it('renders properly', () => {
    const wrapper = mountWithRouter(Result, props);

    expect(wrapper).toContainMatchingElement('TransactionResult');
    expect(wrapper).toContainMatchingElement('button.dialog-close-button');
  });

  it('displays the message properly', () => {
    const wrapper = mountWithRouter(Result, { ...props, error: false, locked: 200 });
    const element = wrapper.find('.transaction-status');

    expect(element.text()).toBe('0.000002LSK will be locked for voting.');
  });

  it('displays the message properly', () => {
    const wrapper = mountWithRouter(Result, { ...props, error: false, unlockable: 300 });
    const element = wrapper.find('.transaction-status');

    expect(element.text()).toBe('0.000003will be available to unlock in {{unlockTime}}h.');
  });

  it('displays the message properly', () => {
    const wrapper = mountWithRouter(Result, {
      ...props, error: false, locked: 200, unlockable: 300,
    });
    const element = wrapper.find('.transaction-status');

    expect(element.text()).toBe('You have now locked0.000002LSK for voting and may unlock0.000003LSK in {{unlockTime}} hours.');
  });

  it('braodcasts the transaction if props.error is false', () => {
    mountWithRouter(Result, { ...props, error: false });

    expect(props.transactionBroadcasted).toHaveBeenCalledWith(
      props.transactions.transactionsCreated[0],
    );
  });

  it('does not braodcast the transaction if props.error is true', () => {
    mountWithRouter(Result, { ...props, error: true });

    expect(props.transactionBroadcasted).not.toHaveBeenCalled();
  });
});
