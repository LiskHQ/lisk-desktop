import React from 'react';
import { mount } from 'enzyme';
import accounts from '../../../../../test/constants/accounts';
import Status from './status';

describe.skip('Delegate Registration Status', () => {
  let wrapper;

  const props = {
    transactionInfo: {
      id: 1,
      account: accounts.genesis,
      username: 'my_delegate_account',
      passphrase: accounts.genesis.passphrase,
      secondPassphrase: null,
      recipientId: '123123L',
      amount: 0,
      timeOffset: 0,
    },
    transactions: {
      confirmed: [],
      txBroadcastError: null,
    },
    transactionBroadcasted: jest.fn(),
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(
      <Status {...props} />,
    );
  });

  it('renders properly Status component', () => {
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
        signedTransaction: { id: 1 },
      },
    };
    wrapper = mount(<Status {...newProps} />);

    expect(props.transactionBroadcasted).toBeCalled();
  });
});
