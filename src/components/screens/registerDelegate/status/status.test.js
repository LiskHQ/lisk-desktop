import { mountWithRouterAndStore } from '@utils/testHelpers';
import accounts from '../../../../../test/constants/accounts';
import Status from './status';

describe('Delegate Registration Status', () => {
  let wrapper;

  const props = {
    account: accounts.genesis,
    transactions: {
      confirmed: [],
      txBroadcastError: null,
    },
    transactionBroadcasted: jest.fn(),
    t: key => key,
  };

  it('renders properly Status component', () => {
    wrapper = mountWithRouterAndStore(
      Status, props, {}, {
        transactions: props.transactions,
      },
    );
    expect(wrapper).toContainMatchingElement('.status-container');
    expect(wrapper).toContainMatchingElement('.result-box-header');
    expect(wrapper).toContainMatchingElement('.body-message');
    expect(wrapper).not.toContainMatchingElement('button.on-retry');
  });

  it('broadcast the transaction properly', () => {
    const newProps = {
      ...props,
      transactions: {
        txSignatureError: null,
        signedTransaction: {
          id: 1,
          signatures: ['1234'],
        },
      },
    };
    wrapper = mountWithRouterAndStore(
      Status, newProps, {}, {
        transactions: {
          ...props.transactions,
          signedTransaction: { signatures: ['1'] },
        },
      },
    );

    expect(props.transactionBroadcasted).toBeCalled();
  });
});
