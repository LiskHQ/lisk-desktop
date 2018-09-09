import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import Amount from './amount';
import i18n from '../../i18n';


describe('Amount', () => {
  const store = configureMockStore([])({});
  it('should have className "transactions__greyLabel" for type 0', () => {
    const inputValue = {
      value: {
        type: 0,
        recipientId: '1085993630748340485L',
        senderId: '1085993630748340485L',
      },
      address: 'address',
    };
    const expectedValue = /greyLabel/g;
    const wrapper = mount(<Amount {...inputValue} />, {
      context: { i18n, store },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
      },
    });
    const html = wrapper.find('#transactionAmount').html();
    expect(html.match(expectedValue))
      .to.have.lengthOf(1);
  });

  it('should have className "transactions__greenLabel" for type 1', () => {
    const inputValue = {
      value: {
        type: 1,
        recipientId: '1085993630748340485L',
        senderId: '1085993630748340485L',
      },
      address: 'address',
    };
    const expectedValue = /greenLabel/g;
    const wrapper = mount(<Amount {...inputValue} />, {
      context: { i18n, store },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
      },
    });
    const html = wrapper.find('#transactionAmount').html();
    expect(html.match(expectedValue))
      .to.have.lengthOf(1);
  });

  it('should have className "transactions__greyLabel" for outgoing transaction', () => {
    const inputValue = {
      value: {
        type: 0,
        recipientId: '1085993630748340485L',
        senderId: 'address',
      },
      address: 'address',
    };
    const expectedValue = /greyLabel/g;
    const wrapper = mount(<Amount {...inputValue} />, {
      context: { i18n, store },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
      },
    });
    const html = wrapper.find('#transactionAmount').html();
    expect(html.match(expectedValue))
      .to.have.lengthOf(1);
  });
});
