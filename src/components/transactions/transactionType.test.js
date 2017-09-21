import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import TransactionType from './transactionType';
import { TooltipWrapper } from '../timestamp';
import i18n from '../../i18n';

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
    const wrapper = mount(<TransactionType {...inputValue} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });
};

describe('TransactionType', () => {
  for (let i = 1; i < 8; i++) {
    createTest(i);
  }

  it('sets TransactionType equal the values of "props.sederId"', () => {
    const store = configureMockStore([])({});
    const inputValue = {
      type: 0,
      senderId: '1085993630748340485L',
    };
    const wrapper = mount(<TransactionType {...inputValue} />, {
      context: { i18n, store },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
      },
    });
    expect(wrapper.find(TooltipWrapper)).to.have.lengthOf(1);
  });
});
