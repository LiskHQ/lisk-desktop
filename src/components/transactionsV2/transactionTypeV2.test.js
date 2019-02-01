import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { MemoryRouter as Router } from 'react-router-dom';
import TransactionTypeV2 from './transactionTypeV2';
import i18n from '../../i18n';

const options = {
  context: { i18n },
  childContextTypes: {
    i18n: PropTypes.object.isRequired,
  },
};

const createTest = (type) => {
  let expectedValue;
  switch (type) {
    case 0:
      expectedValue = 'Transaction';
      break;
    case 1:
      expectedValue = 'Second passphrase registration';
      break;
    case 2:
      expectedValue = 'Delegate registration';
      break;
    case 3:
      expectedValue = 'Delegate vote';
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
      showTransaction: true,
      followedAccounts: [],
    };
    const wrapper = mount(<Router><TransactionTypeV2 {...inputValue} /></Router>, options);
    expect(wrapper.find('.title')).to.have.text(expectedValue);
  });
};

describe('TransactionType V2', () => {
  for (let i = 1; i < 8; i++) {
    createTest(i);
  }
});

it('sets TransactionType equal the values of "props.senderId"', () => {
  const inputValue = {
    type: 0,
    senderId: '1085993630748340485L',
    followedAccounts: [],
  };
  const wrapper = mount(<Router><TransactionTypeV2 {...inputValue} /></Router>, options);
  expect(wrapper.text()).to.equal(inputValue.senderId);
});
