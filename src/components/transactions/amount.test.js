import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Amount from './amount';

describe('<Status />', () => {
  it('expect amount to have className "transactions__grayButton"', () => {
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

  it('expect amount to have className "transactions__inButton"', () => {
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

  it('expect amount to have className "transactions__outButton"', () => {
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
