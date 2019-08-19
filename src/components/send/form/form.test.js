import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';
import Form from './form';
import { tokenMap } from '../../../constants/tokens';

jest.mock('../../../utils/api/btc/transactions', () => ({
  getUnspentTransactionOutputs: jest.fn(() => Promise.resolve([{
    height: 1575216,
    tx_hash: '992545eeab2ac01adf78454f8b49d042efd53ab690d76121ebd3cddca3b600e5',
    tx_pos: 0,
    value: 1,
  }, {
    height: 1575216,
    tx_hash: '992545eeab2ac01adf78454f8b49d042efd53ab690d76121ebd3cddca3b600e5',
    tx_pos: 1,
    value: 397040,
  }])),
  getTransactionFeeFromUnspentOutputs: jest.fn(() => 156000),
}));

describe('Form', () => {
  let wrapper;

  const store = configureMockStore([thunk])({
    settings: { currency: 'USD', token: { active: 'LSK' } },
    settingsUpdated: () => {},
    liskService: {
      success: true,
      LSK: {
        USD: 1,
      },
    },
    bookmarks: {
      LSK: [{
        title: 'ABC',
        address: '12345L',
        balance: 10,
      }, {
        title: 'FRG',
        address: '12375L',
        balance: 15,
      }, {
        title: 'KTG',
        address: '12395L',
        balance: 7,
      }],
    },
    service: {
      dynamicFees: {},
    },
    network: {
      name: 'Mainnet',
    },
  });

  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };

  const props = {
    token: tokenMap.LSK.key,
    t: v => v,
    fields: {
      recipient: { address: '' },
      amount: { value: '' },
      reference: { value: '' },
    },
    prevState: {
      fields: {},
    },
    account: {
      balance: accounts.genesis.balance,
      info: {
        LSK: accounts.genesis,
        BTC: {
          address: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
        },
      },
    },
    bookmarks: {
      LSK: [{
        title: 'ABC',
        address: '12345L',
        balance: 10,
      }, {
        title: 'FRG',
        address: '12375L',
        balance: 15,
      }, {
        title: 'KTG',
        address: '12395L',
        balance: 7,
      }],
      BTC: [],
    },
    dynamicFees: {},
    dynamicFeesRetrieved: jest.fn(),
    networkConfig: {
      name: 'Mainnet',
    },
    history: {
      location: {
        path: '/wallet/send/send',
        search: '?recipient=16313739661670634666L&amount=10&reference=test',
      },
      push: jest.fn(),
    },
  };

  beforeEach(() => {
    wrapper = mount(<Form {...props} />, options);
  });

  it('should render properly', () => {
    expect(wrapper).toContainMatchingElement('span.recipient');
    expect(wrapper).toContainMatchingElement('span.amount');
    expect(wrapper).toContainMatchingElement('label.reference');
    expect(wrapper).not.toContainMatchingElement('PrimaryButton.btn-submit');
  });


  describe('shold work with props.token BTC', () => {
    const dynamicFees = {
      Low: 0.00000156,
      High: 0.0000051,
    };
    it('should re-render properly if props.token', () => {
      wrapper.setProps({
        token: tokenMap.BTC.key,
      });
      expect(wrapper).toContainMatchingElement('span.recipient');
      expect(wrapper).toContainMatchingElement('span.amount');
      expect(wrapper).toContainMatchingElement('div.processing-speed');
      expect(wrapper).not.toContainMatchingElement('label.reference');
    });

    it('should render processingSpeed fee based on dynamicFees', () => {
      wrapper.setProps({
        token: tokenMap.BTC.key,
      });
      wrapper.setProps({ dynamicFees });
      expect(wrapper).toContainMatchingElement('div.processing-speed');
    });

    it.skip('should update processingSpeed fee when "High" is selected', () => {
      wrapper.setProps({
        token: tokenMap.BTC.key,
        fields: {
          amount: {
            value: '0.001',
          },
        },
      });
      wrapper.setProps({ dynamicFees });
      expect(wrapper.find('div.processing-speed')).toIncludeText(dynamicFees.Low);
      wrapper.find('label.option-High').simulate('click');
      expect(wrapper.find('div.processing-speed')).toIncludeText(dynamicFees.High);
    });
  });

  it('should render properly with data from prevState', () => {
    wrapper.setProps({
      prevState: {
        fields: {
          recipient: { address: '' },
          amount: { value: '' },
          reference: { value: '' },
        },
      },
    });
    wrapper.update();
    expect(wrapper).toContainMatchingElement('span.recipient');
    expect(wrapper).toContainMatchingElement('span.amount');
    expect(wrapper).toContainMatchingElement('label.reference');
    expect(wrapper).not.toContainMatchingElement('PrimaryButton.btn-submit');
  });

  it('should validate bookmark', () => {
    const evt = { target: { name: 'recipient', value: '123456L' } };
    wrapper.find('input.recipient').simulate('change', evt);
    jest.advanceTimersByTime(300);
    wrapper.update();
    expect(wrapper.find('.fieldGroup').at(0)).not.toHaveClassName('error');
  });

  it('should validate address', () => {
    props.bookmarks = { LSK: [] };
    wrapper = mount(<Form {...props} />, options);
    const evt = { target: { name: 'recipient', value: '123456L' } };
    wrapper.find('input.recipient').simulate('change', evt);
    jest.advanceTimersByTime(300);
    wrapper.update();
    expect(wrapper.find('.fieldGroup').at(0)).not.toHaveClassName('error');
  });

  describe('Amount field', () => {
    it('Should show converter on correct input', () => {
      const evt = { target: { name: 'amount', value: 1 } };
      let amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField).not.toContainMatchingElement('.converted-price');
      amountField.find('Input').simulate('change', evt);
      jest.advanceTimersByTime(300);
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField).toContainMatchingElement('.converted-price');
    });

    it('Should add leading 0 if . is inserted as first character', () => {
      const evt = { target: { name: 'amount', value: '.1' } };
      let amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('Input').simulate('change', evt);
      jest.advanceTimersByTime(300);
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField.find('Input').prop('value')).toEqual('0.1');
    });

    it('Should show error feedback if wrong data is inserted', () => {
      let amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('Input').simulate('change', { target: { name: 'amount', value: 'abc' } });
      jest.advanceTimersByTime(300);
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField.find('.feedback')).toHaveClassName('error');

      amountField.find('Input').simulate('change', { target: { name: 'amount', value: '1.1.' } });
      jest.advanceTimersByTime(300);
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField.find('.feedback')).toHaveClassName('error');

      amountField.find('Input').simulate('change', { target: { name: 'amount', value: props.account.balance + 2 } });
      jest.advanceTimersByTime(300);
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField.find('.feedback')).toHaveClassName('error');
    });
  });

  describe('Reference field', () => {
    it('Should show error feedback over limit of characters', () => {
      let referenceField = wrapper.find('.fieldGroup').at(2);
      const evt = {
        target: {
          name: 'reference',
          value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit volutpat.',
        },
      };
      referenceField.find('AutoresizeTextarea').simulate('focus');
      referenceField.find('AutoresizeTextarea').simulate('change', evt);
      jest.advanceTimersByTime(300);
      wrapper.update();
      referenceField = wrapper.find('.fieldGroup').at(2);
      expect(referenceField.find('.feedback')).toHaveClassName('show error');
    });
  });
});
