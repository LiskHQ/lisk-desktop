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
  it(`expect text of TransactionType to be equal "${expectedValue}"`, () => {
    const inputValue = {
      type,
      senderId: '1085993630748340485L',
    };
    const wrapper = shallow(<TransactionType {...inputValue} />);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });
};

describe('<TransactionType />', () => {
  for (let i = 1; i < 8; i++) {
    createTest(i);
  }

  it('expect text of TransactionType to be equal "props.sederId"', () => {
    const inputValue = {
      type: 0,
      senderId: '1085993630748340485L',
    };
    const expectedValue = `<div class="">${inputValue.senderId}</div>`;
    const wrapper = shallow(<TransactionType {...inputValue} />);
    expect(wrapper.find(TooltipWrapper).html()).to.be.equal(expectedValue);
  });
//   it('expect amount to have className "transactions__inButton"', () => {
//     const inputValue = {
//       value: {
//         type: 1,
//         recipientId: '1085993630748340485L',
//         senderId: '1085993630748340485L',
//       },
//       address: 'address',
//     };
//     const expectedValue = /transactions__inButton/g;
//     const wrapper = shallow(<Amount {...inputValue} />);
//     const html = wrapper.find('span').html();
//     expect(html.match(expectedValue))
//         .to.have.lengthOf(1);
//   });

//   it('expect amount to have className "transactions__outButton"', () => {
//     const inputValue = {
//       value: {
//         type: 1,
//         recipientId: '1085993630748340485L',
//         senderId: 'address',
//       },
//       address: 'address',
//     };
//     const expectedValue = /transactions__outButton/g;
//     const wrapper = shallow(<Amount {...inputValue} />);
//     const html = wrapper.find('span').html();
//     expect(html.match(expectedValue))
//         .to.have.lengthOf(1);
//   });
});
