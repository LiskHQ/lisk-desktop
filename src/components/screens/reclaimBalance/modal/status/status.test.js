import { mountWithRouterAndStore } from '@utils/testHelpers';
import accounts from '../../../../../../test/constants/accounts';
import Status from './status';

describe('Status', () => {
  let wrapper;

  const state = {
    account: {
      passphrase: 'test',
      info: {
        LSK: accounts.empty_account,
      },
    },
  };

  const props = {
    t: v => v,
    transactionBroadcasted: jest.fn(),
    transactions: {
      confirmed: [],
      transactionsCreated: [],
      transactionsCreatedFailed: [],
      broadcastedTransactionsError: [],
    },
    history: { push: jest.fn() },
  };

  beforeEach(() => {
    wrapper = mountWithRouterAndStore(Status, props, {}, state);
  });

  it('should render properly transactionStatus', () => {
    expect(wrapper).toContainMatchingElement('.transaction-status');
  });

  it('should render close modal and go to wallet when success', () => {
    const newProps = { ...props };
    newProps.transactions.confirmed = [{ amount: 1 }];
    wrapper = mountWithRouterAndStore(Status, newProps, {}, state);
    wrapper.find('.close-modal').at(0).simulate('click');
    expect(props.history.push).toBeCalledWith('/wallet');
  });

  it('should render error message in case of transaction failed', () => {
    const newProps = { ...props };
    newProps.transactions.confirmed = [];
    newProps.transactions.broadcastedTransactionsError = [{ amount: 1 }];
    wrapper = mountWithRouterAndStore(Status, newProps, {}, state);
    expect(wrapper).toContainMatchingElement('.report-error-link');
  });

  it('should call broadcast function again in retry', () => {
    const newProps = { ...props };
    newProps.transactions = {
      confirmed: [],
      broadcastedTransactionsError: [{
        error: { message: 'errorMessage' },
        transaction: { amount: 1 },
      }],
      transactionsCreated: [{ id: 1 }],
      transactionsCreatedFailed: [{ id: 2 }],
    };

    wrapper = mountWithRouterAndStore(Status, newProps, {}, state);
    expect(wrapper).toContainMatchingElement('.report-error-link');
    wrapper.find('.on-retry').at(0).simulate('click');
    expect(props.transactionBroadcasted).toBeCalled();
  });
});
