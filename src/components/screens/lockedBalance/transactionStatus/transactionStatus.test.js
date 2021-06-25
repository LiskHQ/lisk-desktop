import { mountWithRouterAndStore } from '@utils/testHelpers';
import TransactionStatus from './index';

describe('unlock transaction Status', () => {
  let wrapper;

  const props = {
    transactionInfo: undefined,
    error: undefined,
    t: key => key,
    history: {},
  };

  const store = {
    transactions: {
      confirmed: [],
      txBroadcastError: null,
      transactionsCreated: [],
    },
  };

  it('renders properly Status component when transaction is succedfully submitted', () => {
    wrapper = mountWithRouterAndStore(
      TransactionStatus,
      { ...props, transactionInfo: { id: 1 } },
      {},
      { transactions: { ...store.transactions, confirmed: [{ id: 1 }] } },
    );
    const html = wrapper.html();
    expect(html).not.toContain('failed');
    expect(html).not.toContain('something went wrong');
    expect(html).toContain('submitted');
    expect(html).toContain('confirmed');
  });

  it('renders properly Status component when transaction failed', () => {
    wrapper = mountWithRouterAndStore(
      TransactionStatus,
      { ...props, error: { message: 'error:test' } },
      {},
      store,
    );
    const html = wrapper.html();
    expect(html).toContain('failed');
    expect(html).toContain('something went wrong');
    expect(html).not.toContain('submitted');
    expect(html).not.toContain('confirmed');
  });
});
