import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { IconButton } from 'react-toolbox/lib/button';
import Status from './status';

describe('Status', () => {
  it('shows "replay" icon for sender and receiver are the same', () => {
    const inputValue = {
      value: {
        type: 0,
        recipientId: '1085993630748340485L',
        senderId: '1085993630748340485L',
      },
      address: 'address',
    };
    const expectedValue = 'replay';
    const wrapper = shallow(<Status {...inputValue} />);
    expect(wrapper.find(IconButton).get(0).props.icon)
      .to.equal(expectedValue);
  });

  it('shows "call_received" icon for type 1', () => {
    const inputValue = {
      value: {
        type: 1,
        recipientId: '1085993630748340485L',
        senderId: '1085993630748340485L',
      },
      address: 'address',
    };
    const expectedValue = 'call_received';
    const wrapper = shallow(<Status {...inputValue} />);
    expect(wrapper.find(IconButton).get(0).props.icon)
      .to.equal(expectedValue);
  });

  it('shows "call_made" icon for outgoing transaction', () => {
    const inputValue = {
      value: {
        type: 1,
        recipientId: '1085993630748340485L',
        senderId: 'address',
      },
      address: 'address',
    };
    const expectedValue = 'call_made';
    const wrapper = shallow(<Status {...inputValue} />);
    expect(wrapper.find(IconButton).get(0).props.icon)
      .to.equal(expectedValue);
  });
});
