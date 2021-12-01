import { mountWithRouterAndStore } from '@utils/testHelpers';
import Status from './status';
import accounts from '../../../../../test/constants/accounts';
import signedTX from '../../../../../test/fixtures/signedTx.json';

describe('unlock transaction Status', () => {
  const props = {
    t: key => key,
    account: accounts.genesis,
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: { signatures: ['123'] },
    },
  };

  it('renders a pending state when the transactions not submitted yet.', () => {
    const propsWithSignedTx = {
      ...props,
      transactions: {
        txBroadcastError: null,
        txSignatureError: null,
        signedTransaction: signedTX,
      },
    };

    const wrapper = mountWithRouterAndStore(
      Status, propsWithSignedTx, {}, {
        transactions: propsWithSignedTx.transactions,
      },
    );
    expect(wrapper.find('.dialog-close-button')).toExist();
  });

  it('renders properly Status component when transaction failed', () => {
    const propsWithError = {
      ...props,
      transactions: {
        txBroadcastError: { message: 'error:test' },
        txSignatureError: null,
        signedTransaction: { signatures: ['123'] },
      },
    };

    const wrapper = mountWithRouterAndStore(
      Status, propsWithError, {}, {
        transactions: propsWithError.transactions,
      },
    );
    const html = wrapper.html();
    expect(html).toContain('failed');
    expect(html).toContain('something went wrong');
    expect(html).not.toContain('submitted');
    expect(html).not.toContain('confirmed');
  });
});
