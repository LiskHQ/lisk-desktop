import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import TransactionDetail from './transactionDetail';

describe('TransactionDetail ', () => {
  let wrapper;

  const props = {
    transaction: {
      type: 0,
      asset: {},
    },
    t: data => data,
  };

  beforeEach(() => {
    wrapper = mount(<TransactionDetail {...props} />);
  });

  it('should render "-" if no data is provided', () => {
    expect(wrapper).to.have.text('-');
  });

  it('should render the message if transaction has message set', () => {
    const newProps = {
      transaction: { asset: { data: 'test-details' } },
    };
    wrapper.setProps(newProps);
    expect(wrapper).to.have.text(newProps.transaction.asset.data);
  });

  it('should render delegateName if type=2', () => {
    const newProps = {
      transaction: {
        asset: { delegate: { username: 'delegateName' } },
        type: 2,
      },
    };
    wrapper.setProps(newProps);
    expect(wrapper).to.have.text(newProps.transaction.asset.delegate.username);
  });

  it('should render votes and unvotes count if type=3', () => {
    const newProps = {
      transaction: {
        asset: { votes: ['+12345L', '+123456789L', '-123L'] },
        type: 3,
      },
    };
    wrapper.setProps(newProps);
    expect(wrapper.find('.txDetails')).to.have.className('delegateVote');
    expect(wrapper).to.have.text('↑ 2 Votes, ↓ 1 Unvotes');
  });
});
