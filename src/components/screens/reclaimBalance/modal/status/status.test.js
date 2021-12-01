import { mountWithRouterAndStore } from '@utils/testHelpers';
import accounts from '../../../../../../test/constants/accounts';
import Status from './status';

describe('Status', () => {
  let wrapper;

  const state = {
    account: {
      passphrase: 'test',
      info: {
        LSK: accounts.non_migrated,
      },
    },
  };

  const props = {
    t: v => v,
    transactionBroadcasted: jest.fn(),
    transactions: {
      confirmed: [],
      signedTransaction: {},
      txSignatureError: null,
      txBroadcastError: null,
    },
    transactionInfo: {},
    history: { push: jest.fn() },
  };

  beforeEach(() => {
    wrapper = mountWithRouterAndStore(Status, props, {}, state);
  });

  it('should render properly transactionStatus', () => {
    expect(wrapper).toContainMatchingElement('.transaction-status');
  });

  it('should render close modal and go to wallet when success', () => {
    const newProps = { ...props, isMigrated: true };
    newProps.transactions.confirmed = [{ amount: 1 }];
    wrapper = mountWithRouterAndStore(Status, newProps, {}, state);
    wrapper.find('.back-to-wallet-button').at(0).simulate('click');
    expect(props.history.push).toBeCalledWith('/wallet');
  });

  it('should render error message in case of transaction failed', () => {
    const newProps = { ...props };
    newProps.transactions.confirmed = [];
    newProps.transactions.txBroadcastError = { amount: 1 };
    wrapper = mountWithRouterAndStore(Status, newProps, {}, state);
    expect(wrapper.html()).toContain('Transaction');
  });
});
