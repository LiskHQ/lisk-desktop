import React from 'react';
import { mount } from 'enzyme';
import TransactionStatus from './transactionStatus';

describe('unlock transaction Status', () => {
  let wrapper;

  const props = {
    transactions: {
      confirmed: [],
      broadcastedTransactionsError: [],
    },
    transactionBroadcasted: jest.fn(),
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(
      <TransactionStatus {...props} />,
    );
  });

  it('renders properly Status component when transaction is succedfully submitted', () => {
    expect(wrapper).toContainMatchingElement('.transaction-status');
    expect(wrapper).toContainMatchingElement('.result-box-header');
    expect(wrapper).toContainMatchingElement('.body-message');
    expect(wrapper).not.toContainMatchingElement('button.on-retry');
  });

  it('renders properly Status component when transaction failed on being submitted and call props.transactionBroadcasted', () => {
    const customProps = {
      ...props,
      transactions: {
        ...props.transactions,
        broadcastedTransactionsError: [{}],
      },
    };
    wrapper = mount(
      <TransactionStatus {...customProps} />,
    );
    expect(wrapper).toContainMatchingElement('.transaction-status');
    expect(wrapper).toContainMatchingElement('.result-box-header');
    expect(wrapper).toContainMatchingElement('.body-message');
    expect(wrapper).toContainMatchingElement('button.on-retry');
    wrapper.find('button.on-retry').at(0).simulate('click');
    expect(customProps.transactionBroadcasted).toBeCalled();
  });
});
