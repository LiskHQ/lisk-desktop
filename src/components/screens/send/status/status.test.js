import { mountWithRouter } from '@utils/testHelpers';
import Status from './status';

describe('Status', () => {
  let wrapper;

  const props = {
    t: v => v,
    finalCallback: jest.fn(),
    failedTransactions: undefined,
    bookmarks: {
      LSK: [],
    },
    account: {
      summary: { address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6' },
      hwInfo: { deviceId: 'MOCK' },
    },
    prevStep: jest.fn(),
    fields: {
      recipient: {
        address: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
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
      signedTransaction: {},
      txSignatureError: null,
      txBroadcastError: null,
    },
    recipientAccount: {
      data: {},
      loadData: jest.fn(),
    },
  };

  beforeEach(() => {
    wrapper = mountWithRouter(Status, props, {
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
    wrapper = mountWithRouter(Status, {
      ...props,
      account: {
        summary: {
          address: props.fields.recipient.address,
        },
        hwInfo: { deviceId: 'MOCK' },
      },
    });
    expect(wrapper).not.toContainMatchingElement('.bookmark-container');
    expect(wrapper).not.toContainMatchingElement('.bookmark-btn');

    wrapper = mountWithRouter(Status, {
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
    newProps.transactions.txBroadcastError = { recipient: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy', amount: 1, reference: 'test' };
    wrapper = mountWithRouter(Status, newProps);
    expect(wrapper).toContainMatchingElement('.report-error-link');
  });

  it('should call onPrevStep function on hwWallet', () => {
    const newProps = { ...props };
    newProps.account.hwInfo.deviceId = 'mock';
    newProps.fields.hwTransactionStatus = 'error';
    newProps.failedTransactions = [{
      error: { message: 'errorMessage' },
      transaction: { recipient: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy', amount: 1, reference: 'test' },
    }];
    wrapper = mountWithRouter(Status, newProps);
    expect(wrapper).toContainMatchingElement('.report-error-link');
    wrapper.find('.retry').at(0).simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('should call resetTransactionResult on unmount', () => {
    wrapper.unmount();
    expect(props.resetTransactionResult).toHaveBeenCalled();
  });
});
