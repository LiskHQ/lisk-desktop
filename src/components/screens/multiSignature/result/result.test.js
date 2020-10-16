import { mountWithRouterAndStore } from '../../../../utils/testHelpers';
import Result from './index';

describe('Multisignature result component', () => {
  let wrapper;

  const props = {
    t: v => v,
  };

  const store = {
    transactions: {
      confirmed: [],
      broadcastedTransactionsError: [],
      transactionsCreated: [],
    },
  };

  it('Should render properly on success', () => {
    wrapper = mountWithRouterAndStore(
      Result,
      { ...props, transactionInfo: { id: 1 } },
      {},
      { transactions: { ...store.transactions, confirmed: [{ id: 1 }] } },
    );
    const html = wrapper.html();
    expect(html).toContain('transaction-status');
    expect(html).toContain('You have successfully signed the transaction');
    expect(html).toContain('Download');
    expect(html).toContain('Copy');
  });

  it('Should render properly on error', () => {
    wrapper = mountWithRouterAndStore(
      Result,
      { ...props, error: { message: 'error:test' } },
      {},
      store,
    );
    const html = wrapper.html();
    expect(html).toContain('transaction-status');
    expect(html).toContain('Oops, looks like something went wrong.');
    expect(html).toContain('Report the error via E-Mail');
  });
});
