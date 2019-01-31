import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import AmountV2 from './amountV2';
import i18n from '../../i18n';


describe('Amount', () => {
  it('should have className "greenLabel" for type 0', () => {
    const props = {
      value: {
        type: 0,
        recipientId: '1085993630748340485L',
        senderId: '1085993630748340485L',
      },
      address: 'address',
    };
    const wrapper = mount(<AmountV2 {...props} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });
    expect(wrapper.find('.transactionAmount'))
      .to.have.className('greenLabel');
  });

  it('should have className "greenLabel" for type 1', () => {
    const props = {
      value: {
        type: 1,
        recipientId: '1085993630748340485L',
        senderId: '1085993630748340485L',
      },
      address: 'address',
    };
    const wrapper = mount(<AmountV2 {...props} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });
    expect(wrapper.find('.transactionAmount'))
      .to.have.className('greenLabel');
  });

  it('should have className "greyLabel" for outgoing transaction', () => {
    const props = {
      value: {
        type: 0,
        recipientId: '1085993630748340485L',
        senderId: 'address',
      },
      address: 'address',
    };
    const wrapper = mount(<AmountV2 {...props} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });
    expect(wrapper.find('.transactionAmount'))
      .to.have.className('greyLabel');
  });
});
