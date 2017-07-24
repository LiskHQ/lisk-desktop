import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Address from './address';

describe('Address', () => {
  it('when value of "isDelegate" is "false" expect text of "h3#firstBox" to be equal "Address"', () => {
    const inputValue = {
      isDelegate: false,
      address: '16313739661670634666L',
    };
    const expectedHeaderValue = 'Address';
    const wrapper = shallow(<Address {...inputValue} />);
    expect(wrapper.find('#firstBox').text()).to.be.equal(expectedHeaderValue);
  });

  it('when value of "isDelegate" is "true" expect text of "h3#firstBox" to be equal "Delegate"', () => {
    const inputValue = {
      isDelegate: true,
      address: '16313739661670634666L',
      delegate: {
        username: 'lisk-nano',
      },
    };
    const expectedHeaderValue = 'Delegate';
    const wrapper = shallow(<Address {...inputValue} />);
    expect(wrapper.find('#firstBox').text()).to.be.equal(expectedHeaderValue);
  });

  it('when value of "isDelegate" is "true" expect text of "p.secondary" to be equal expectedValue', () => {
    const inputValue = {
      isDelegate: true,
      address: '16313739661670634666L',
      delegate: {
        username: 'lisk-nano',
      },
    };
    const expectedValue = 'lisk-nano';
    const wrapper = shallow(<Address {...inputValue} />);
    expect(wrapper.find('p.primary').text()).to.be.equal(expectedValue);
  });
});
