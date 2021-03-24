import { mountWithRouter } from '../../../../utils/testHelpers';
import TransactionStatus from './transactionStatus';

describe('TransactionStatus', () => {
  let wrapper;

  const props = {
    t: v => v,
    finalCallback: jest.fn(),
    failedTransactions: undefined,
    transactionFailedClear: jest.fn(),
    bookmarks: {
      LSK: [],
    },
    account: {
      summary: { address: '312312Z' },
      hwInfo: { deviceId: 'MOCK' },
    },
    prevStep: jest.fn(),
    fields: {
      recipient: {
        address: '123123L',
      },
      amount: {
        value: 1,
      },
      reference: {
        value: 1,
      },
      isLoading: false,
      isHardwareWalletConnected: false,
    },
    resetTransactionResult: jest.fn(),
    transactionBroadcasted: jest.fn(),
    transactions: {
      transactionsCreated: [],
      transactionsCreatedFailed: [],
      broadcastedTransactionsError: [],
    },
    recipientAccount: {
      data: {},
      loadData: jest.fn(),
    },
  };

  beforeEach(() => {
    wrapper = mountWithRouter(TransactionStatus, props, {
      pathname: 'wallet',
      search: '?modal=send',
    });
  });

  it('should render properly transactionStatus', () => {
    expect(wrapper).toContainMatchingElement('.transaction-status');
  });

  it('should show add bookmark button', () => {
    expect(wrapper).toContainMatchingElement('.bookmark-container');
    expect(wrapper).toContainMatchingElement('.bookmark-btn');
    expect(wrapper.find('.bookmark-btn').at(0).text()).toEqual('Add address to bookmarks');
  });

  it('should not show add bookmark button', () => {
    wrapper = mountWithRouter(TransactionStatus, {
      ...props,
      account: { address: props.fields.recipient.address, hwInfo: { deviceId: 'MOCK' } },
    });
    expect(wrapper).not.toContainMatchingElement('.bookmark-container');
    expect(wrapper).not.toContainMatchingElement('.bookmark-btn');

    wrapper = mountWithRouter(TransactionStatus, {
      ...props,
      bookmarks: {
        LSK: [{ address: props.fields.recipient.address }],
      },
    });
    expect(wrapper).not.toContainMatchingElement('.bookmark-container');
    expect(wrapper).not.toContainMatchingElement('.bookmark-btn');
  });

  it('should render error message in case of transaction failed', () => {
    const newProps = { ...props };
    newProps.transactions.broadcastedTransactionsError = [{ recipient: '123L', amount: 1, reference: 'test' }];
    wrapper = mountWithRouter(TransactionStatus, newProps);
    expect(wrapper).toContainMatchingElement('.report-error-link');
  });

  it('should call onPrevStep function on hwWallet', () => {
    const newProps = { ...props };
    newProps.fields.isHardwareWalletConnected = true;
    newProps.fields.hwTransactionStatus = 'error';
    newProps.failedTransactions = [{
      error: { message: 'errorMessage' },
      transaction: { recipient: '123L', amount: 1, reference: 'test' },
    }];
    wrapper = mountWithRouter(TransactionStatus, newProps);
    expect(wrapper).toContainMatchingElement('.report-error-link');
    wrapper.find('.retry').at(0).simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('should call broadcast function again in retry', () => {
    const newProps = { ...props };
    newProps.transactions = {
      broadcastedTransactionsError: [{
        error: { message: 'errorMessage' },
        transaction: { recipient: '123L', amount: 1, reference: 'test' },
      }],
      transactionsCreated: [{ id: 1 }],
      transactionsCreatedFailed: [{ id: 2 }],
    };

    wrapper = mountWithRouter(TransactionStatus, newProps);
    expect(wrapper).toContainMatchingElement('.report-error-link');
    wrapper.find('.retry').at(0).simulate('click');
    expect(props.transactionBroadcasted).toBeCalled();
  });

  it('should call resetTransactionResult on unmount', () => {
    wrapper.unmount();
    expect(props.resetTransactionResult).toHaveBeenCalled();
  });
});
