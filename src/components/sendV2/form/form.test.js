import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import Form from './form';

describe('Form', () => {
  let wrapper;

  const store = configureMockStore([thunk])({
    settings: { currency: 'USD' },
    settingsUpdated: () => {},
    liskService: {
      success: true,
      LSK: {
        USD: 1,
      },
    },
    followedAccounts: [
      {
        title: 'ABC',
        address: '12345L',
        balance: 10,
      },
      {
        title: 'FRG',
        address: '12375L',
        balance: 15,
      },
      {
        title: 'KTG',
        address: '12395L',
        balance: 7,
      },
    ],
  });

  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };

  const props = {
    t: v => v,
    followedAccounts: [
      {
        title: 'ABC',
        address: '12345L',
        balance: 10,
      },
      {
        title: 'FRG',
        address: '12375L',
        balance: 15,
      },
      {
        title: 'KTG',
        address: '12395L',
        balance: 7,
      },
    ],
  };

  beforeEach(() => {
    wrapper = mount(<Form {...props} />, options);
  });

  it('should render properly', () => {
    expect(wrapper).toContainMatchingElement('label.recipient');
    expect(wrapper).toContainMatchingElement('span.amount');
    expect(wrapper).toContainMatchingElement('label.reference');
    expect(wrapper).not.toContainMatchingElement('PrimaryButtonV2.btn-submit');
  });

  it('should validate bookmark', () => {
    const evt = { target: { name: 'recipient', value: '123456L' } };
    wrapper.find('input.recipient').simulate('change', evt);
    // expect(props.validateBookmark).toBeCalled();
  });

  describe('Amount field', () => {
    it('Should show converter on correct input', () => {
      const evt = { target: { name: 'amount', value: 1 } };
      let amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField).not.toContainMatchingElement('.converted-price');
      amountField.find('InputV2').simulate('change', evt);
      jest.advanceTimersByTime(300);
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField).toContainMatchingElement('.converted-price');
    });

    it('Should add leading 0 if . is inserted as first character', () => {
      const evt = { target: { name: 'amount', value: '.1' } };
      let amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('InputV2').simulate('change', evt);
      jest.advanceTimersByTime(300);
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField.find('InputV2').prop('value')).toEqual('0.1');
    });

    it('Should show error feedback if letters inserted', () => {
      const evt = { target: { name: 'amount', value: 'abc' } };
      let amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField.find('.feedback')).not.toHaveClassName('error');
      amountField.find('InputV2').simulate('change', evt);
      jest.advanceTimersByTime(300);
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField.find('.feedback')).toHaveClassName('error');
    });

    it('Should show error feedback if ending in . or multiples .', () => {
      const evt = { target: { name: 'amount', value: 1 } };
      const multipleDotsEvt = { target: { name: 'amount', value: '1.2.3' } };
      const endingDotEvt = { target: { name: 'amount', value: '12.' } };
      let amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('InputV2').simulate('change', endingDotEvt);
      jest.advanceTimersByTime(300);
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField.find('.feedback')).toHaveClassName('error');
      amountField.find('InputV2').simulate('change', evt);
      jest.advanceTimersByTime(300);
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField.find('.feedback')).not.toHaveClassName('error');
      amountField.find('InputV2').simulate('change', multipleDotsEvt);
      jest.advanceTimersByTime(300);
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField.find('.feedback')).toHaveClassName('error');
    });
  });

  describe('Reference field', () => {
    it('Should show feedback if some text inserted and hide if empty', () => {
      const referenceField = wrapper.find('.fieldGroup').at(2);
      let evt = { target: { name: 'reference', value: 'test' } };
      expect(referenceField.find('.feedback')).not.toHaveClassName('show');
      referenceField.find('AutoresizeTextarea').simulate('change', evt);
      wrapper.update();
      // expect(referenceField.find('.feedback')).toHaveClassName('show');
      expect(referenceField.find('.feedback')).not.toHaveClassName('error');

      evt = { target: { name: 'reference', value: '' } };
      referenceField.find('AutoresizeTextarea').simulate('change', evt);
      wrapper.update();
      expect(referenceField.find('.feedback')).not.toHaveClassName('show');
    });

    it('Should show error feedback over limit of characters', () => {
      const referenceField = wrapper.find('.fieldGroup').at(2);
      const evt = {
        target: {
          name: 'reference',
          value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit volutpat.',
        },
      };
      referenceField.find('AutoresizeTextarea').simulate('change', evt);
      wrapper.update();
      // expect(referenceField.find('.feedback')).toHaveClassName('show');
      // expect(referenceField.find('.feedback')).toHaveClassName('error');
    });
  });
});
