import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Amount from './amount';

describe('Amount', () => {
  it('should have className "transactions__grayButton" for type 0', () => {
    const inputValue = {
      value: {
        type: 0,
        recipientId: '1085993630748340485L',
        senderId: '1085993630748340485L',
      },
      address: 'address',
    };
    const expectedValue = /transactions__grayButton/g;
    const wrapper = shallow(<Amount {...inputValue} />);
    const html = wrapper.find('span').html();
    expect(html.match(expectedValue))
        .to.have.lengthOf(1);
  });

  it('should have className "transactions__inButton" for type 1', () => {
    const inputValue = {
      value: {
        type: 1,
        recipientId: '1085993630748340485L',
        senderId: '1085993630748340485L',
      },
      address: 'address',
    };
    const expectedValue = /transactions__inButton/g;
    const wrapper = shallow(<Amount {...inputValue} />);
    const html = wrapper.find('span').html();
    expect(html.match(expectedValue))
        .to.have.lengthOf(1);
  });

  it('should have className "transactions__outButton" for outgoing transaction', () => {
    const inputValue = {
      value: {
        type: 1,
        recipientId: '1085993630748340485L',
        senderId: 'address',
      },
      address: 'address',
    };
    const expectedValue = /transactions__outButton/g;
    const wrapper = shallow(<Amount {...inputValue} />);
    const html = wrapper.find('span').html();
    expect(html.match(expectedValue))
        .to.have.lengthOf(1);
  });
});
