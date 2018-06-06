import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import DelegateList from './delegateList';

describe('DelegateList', () => {
  const delegate1 = {
    publicKey: 'sample_key_1', address: '100001L', rank: 1, productivity: 99,
  };
  const delegate2 = {
    publicKey: 'sample_key_2', address: '100002L', rank: 2, productivity: 98,
  };
  const delegate3 = {
    publicKey: 'sample_key_3', address: '100003L', rank: 3, productivity: 97,
  };
  const props = {
    showChangeSummery: false,
    list: [delegate1, delegate2, delegate3],
    nextStep: () => {},
    voteToggled: () => {},
    loadMore: () => {},
    safari: 'safari-hack',
    votes: {
      delegate1: { confirmed: true, unconfirmed: true, ...delegate1 },
      delegate2: { confirmed: true, unconfirmed: true, ...delegate2 },
    },
  };

  it('should render no delegates in first render period', () => {
    const wrapper = mount(<DelegateList {...props} />);
    expect(wrapper.find('DelegateRow')).to.have.lengthOf(0);
  });

  it('should render all the delegates in props.list after component received new props', () => {
    const wrapper = mount(<DelegateList {...props} />);
    wrapper.setProps({ any: 'any' });
    expect(wrapper.find('ul.delegate-row')).to.have.lengthOf(props.list.length);
  });
});
