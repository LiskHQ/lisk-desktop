import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import TransactionType from './transactionType';
import { TooltipWrapper } from '../timestamp';
import history from '../../history';
import i18n from '../../i18n';

const store = configureMockStore([])({
  peers: {
    data: {},
  },
  account: {},
});

const options = {
  context: { i18n, store, history },
  childContextTypes: {
    store: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  },
};

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
    const wrapper = mount(<Router><TransactionType {...inputValue} /></Router>, options);
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });
};

describe('TransactionType', () => {
  for (let i = 1; i < 8; i++) {
    createTest(i);
  }

  it('sets TransactionType equal the values of "props.senderId"', () => {
    const inputValue = {
      type: 0,
      senderId: '1085993630748340485L',
    };
    const wrapper = mount(<Router><TransactionType {...inputValue} /></Router>, options);
    expect(wrapper.find(TooltipWrapper)).to.have.lengthOf(1);
  });
});
