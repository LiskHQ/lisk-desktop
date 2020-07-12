import React from 'react';
import { mount } from 'enzyme';
import accounts from '../../../../../test/constants/accounts';
import Status from './status';
import DialogHolder from '../../../toolbox/dialog/holder';

describe('Delegate Registration Status', () => {
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
      broadcastedTransactionsError: [],
    },
    transactionBroadcasted: jest.fn(),
    t: key => key,
  };

  beforeEach(() => {
    DialogHolder.hideDialog = jest.fn();
    wrapper = mount(
        <Status {...props} />
    );
  });

  it('renders properly Status component', () => {
    expect(wrapper).toContainMatchingElement('.status-container');
    expect(wrapper).toContainMatchingElement('.result-box-header');
    expect(wrapper).toContainMatchingElement('.body-message');
    expect(wrapper).toContainMatchingElement('button.close-modal');
    expect(wrapper).not.toContainMatchingElement('button.on-retry');
  });

  it('broadcast the transaction properly', () => {
    const newProps = {
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
      ...props,
    };
    wrapper = mount(<Status {...newProps} />);

    expect(props.transactionBroadcasted).toBeCalled();
    wrapper.setProps({
      transactions: {
        confirmed: [{
          id: 1,
          account: accounts.genesis,
          username: 'my_delegate_account',
          passphrase: accounts.genesis.passphrase,
          secondPassphrase: null,
          recipientId: '123123L',
          amount: 0,
          timeOffset: 0,
        }],
        broadcastedTransactionsError: [],
      },
    });
    wrapper.update();
    wrapper.find('button.close-modal').simulate('click');
    expect(DialogHolder.hideDialog).toHaveBeenCalled();
  });
});
