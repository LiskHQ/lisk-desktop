import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TransactionType from './transactionType';
import { TooltipWrapper } from '../timestamp';

const createTest = (type) => {
  let expectedValue;
  switch (type) {
    case 1:
      expectedValue = 'Second Signature Creation';
      break;
    case 2:
      expectedValue = 'Delegate Registration';
      break;
    case 3:
      expectedValue = 'Vote';
      break;
    case 4:
      expectedValue = 'Multisignature Creation';
      break;
    case 5:
      expectedValue = 'Blockchain Application Registration';
      break;
    case 6:
      expectedValue = 'Send Lisk to Blockchain Application';
      break;
    case 7:
      expectedValue = 'Send Lisk from Blockchain Application';
      break;
    default:
      expectedValue = false;
      break;
  }
  it(`show TransactionType equal to "${expectedValue}" for transaction type ${type}`, () => {
    const inputValue = {
      type,
      senderId: '1085993630748340485L',
    };
    const wrapper = shallow(<TransactionType {...inputValue} />);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });
};

describe('TransactionType', () => {
  for (let i = 1; i < 8; i++) {
    createTest(i);
  }

  it('sets TransactionType equal the values of "props.sederId"', () => {
    const inputValue = {
      type: 0,
      senderId: '1085993630748340485L',
    };
    const expectedValue = `<div class="">${inputValue.senderId}</div>`;
    const wrapper = shallow(<TransactionType {...inputValue} />);
    expect(wrapper.find(TooltipWrapper).html()).to.be.equal(expectedValue);
  });
});
