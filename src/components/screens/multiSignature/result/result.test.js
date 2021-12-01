import { mountWithRouterAndStore } from '@utils/testHelpers';
import Result from './result';

describe('Multisignature result component', () => {
  let wrapper;

  const props = {
    t: v => v,
    transactions: {
      confirmed: [],
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: { signatures: ['123', '987'] },
    },
  };

  it('Should render properly on success', () => {
    wrapper = mountWithRouterAndStore(
      Result,
      props,
      {},
      {
        transactions: {
          ...props.transactions,
          confirmed: [{ id: 1 }],
        },
      },
    );
    const html = wrapper.html();
    expect(html).toContain('transaction-status');
    expect(html).toContain('Your transaction has been submitted and will be confirmed in a few moments.');
    expect(html).toContain('Download');
    expect(html).toContain('Copy');
  });

  it('Should render properly on error', () => {
    wrapper = mountWithRouterAndStore(
      Result,
      props,
      {},
      {
        transactions: {
          ...props.transactions,
          txBroadcastError: { message: 'error:test' },
        },
      },
    );
    const html = wrapper.html();
    expect(html).toContain('transaction-status');
    expect(html).toContain('Oops, looks like something went wrong.');
    expect(html).toContain('Report the error via email');
  });
});
