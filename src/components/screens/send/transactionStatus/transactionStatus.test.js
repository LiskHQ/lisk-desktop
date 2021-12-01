import { mountWithRouterAndStore } from '@utils/testHelpers';
import { tokenMap } from '@constants';
import TransactionStatus from './transactionStatus';
import accounts from '../../../../../test/constants/accounts';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
}));

describe('TransactionStatus', () => {
  let wrapper;

  const props = {
    account: accounts.genesis,
    recipientAccount: { data: accounts.delegate },
    transactions: {
      signedTransaction: {},
      txSignatureError: null,
      txBroadcastError: null,
    },
    rawTransaction: {},
    bookmarks: {
      LSK: [{ address: 'lsk1' }],
    },
    token: tokenMap.LSK.key,
    t: v => v,
  };

  it('should render properly transactionStatus', () => {
    wrapper = mountWithRouterAndStore(
      TransactionStatus, props, {}, {
        transactions: props.transactions,
      },
    );
    expect(wrapper).toContainMatchingElement('.transaction-status');
  });

  it('should show add bookmark button', () => {
    wrapper = mountWithRouterAndStore(
      TransactionStatus, props, {}, {
        transactions: props.transactions,
      },
    );
    expect(wrapper).toContainMatchingElement('.bookmark-container');
    expect(wrapper).toContainMatchingElement('.bookmark-btn');
    expect(wrapper.find('.bookmark-btn').at(0)).toHaveText('Add address to bookmarks');
  });

  it('should not show add bookmark button', () => {
    wrapper = mountWithRouterAndStore(
      TransactionStatus,
      {
        ...props,
        recipientAccount: {
          data: {
            ...accounts.delegate,
            summary: {
              ...accounts.delegate.summary,
              address: 'lsk1',
            },
          },
        },
        rawTransaction: { recipientAddress: 'lsk1' },
      },
      {},
      {
        transactions: props.transactions,
      },
    );
    expect(wrapper).not.toContainMatchingElement('.bookmark-container');
    expect(wrapper).not.toContainMatchingElement('.bookmark-btn');
  });

  it('should render error message in case of transaction failed', () => {
    const newProps = { ...props };
    newProps.transactions.txBroadcastError = { recipient: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy', amount: 1, reference: 'test' };
    wrapper = mountWithRouterAndStore(
      TransactionStatus, newProps, {}, {
        transactions: {
          signedTransaction: { signatures: ['1'] },
          txSignatureError: null,
          txBroadcastError: newProps.transactions.txBroadcastError,
        },
      },
    );
    expect(wrapper.html()).toContain('An error occurred while sending your transaction to the network. Please try again.');
  });
});
