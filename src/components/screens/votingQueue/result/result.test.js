import { mountWithRouter } from '@utils/testHelpers';
import Result from './result';

const props = {
  t: s => s,
  history: { push: jest.fn() },
  transactions: { txSignatureError: null, signedTransaction: {} },
  transactionBroadcasted: jest.fn(),
};

beforeEach(() => {
  props.transactionBroadcasted.mockClear();
});

describe.skip('VotingQueue.Resuly', () => {
  it('renders properly', () => {
    const wrapper = mountWithRouter(Result, props);

    expect(wrapper).toContainMatchingElement('TransactionResult');
    expect(wrapper).toContainMatchingElement('button.dialog-close-button');
  });

  it('displays the locked message properly', () => {
    const wrapper = mountWithRouter(Result, { ...props, error: false, locked: 200 });
    const element = wrapper.find('.transaction-status');

    expect(element.text()).toBe('0.000002 LSK will be locked for voting.');
  });

  it('displays the unlocked message properly', () => {
    const wrapper = mountWithRouter(Result, { ...props, error: false, unlockable: 300 });
    const element = wrapper.find('.transaction-status');

    expect(element.text()).toBe('0.000003 LSK will be available to unlock in {{unlockTime}}h.');
  });

  it('displays the combined message properly', () => {
    const wrapper = mountWithRouter(Result, {
      ...props, error: false, locked: 200, unlockable: 300,
    });
    const element = wrapper.find('.transaction-status');

    expect(element.text()).toBe('You have now locked0.000002 LSKfor voting and may unlock0.000003 LSKin {{unlockTime}} hours.');
  });

  it('braodcasts the transaction if props.error is false', () => {
    mountWithRouter(Result, { ...props, error: false });

    expect(props.transactionBroadcasted).toHaveBeenCalledWith(
      props.transactions.signedTransaction,
    );
  });

  it('does not braodcast the transaction if props.error is true', () => {
    mountWithRouter(Result, { ...props, error: true });

    expect(props.transactionBroadcasted).not.toHaveBeenCalled();
  });
});
