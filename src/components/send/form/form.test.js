import PropTypes from 'prop-types';
import React from 'react';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { fromRawLsk } from '../../../utils/lsk';
import { tokenMap } from '../../../constants/tokens';
import Form from './form';
import accounts from '../../../../test/constants/accounts';
import i18n from '../../../i18n';

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
  getTransactionFeeFromUnspentOutputs: jest.fn(({ dynamicFeePerByte }) => dynamicFeePerByte),
}));

describe('Form', () => {
  let wrapper;
  let props;
  let bookmarks;
  let store;
  let options;

  beforeEach(() => {
    bookmarks = {
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
    };

    store = configureMockStore([thunk])({
      settings: { currency: 'USD', token: { active: 'LSK' } },
      settingsUpdated: () => {},
      liskService: {
        success: true,
        LSK: {
          USD: 1,
        },
      },
      bookmarks,
      service: {
        dynamicFees: {},
      },
      network: {
        name: 'Mainnet',
      },
    });

    options = {
      context: { i18n, store },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
      },
    };

    props = {
      token: tokenMap.LSK.key,
      t: v => v,
      account: {
        balance: accounts.genesis.balance,
        info: {
          LSK: accounts.genesis,
          BTC: {
            address: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
          },
        },
      },
      bookmarks,
      dynamicFees: {},
      dynamicFeesRetrieved: jest.fn(),
      networkConfig: {
        name: 'Mainnet',
      },
      history: {
        location: {
          path: '/wallet/send',
          search: '',
        },
        push: jest.fn(),
      },
      nextStep: jest.fn(),
    };

    wrapper = mount(<Form {...props} />, options);
  });

  it('should render properly', () => {
    expect(wrapper).toContainMatchingElement('span.recipient');
    expect(wrapper).toContainMatchingElement('span.amount');
    expect(wrapper).toContainMatchingElement('label.reference');
    expect(wrapper).not.toContainMatchingElement('PrimaryButton.btn-submit');
  });

  it('should render properly with data from prevState', () => {
    const { address } = accounts.genesis;
    const fields = {
      recipient: {
        address, value: address, error: false, feedback: '', title: '',
      },
      amount: { value: '1.0' },
      reference: { value: 'message' },
    };
    wrapper = mount(<Form {...{
      ...props,
      prevState: { fields },
    }}
    />, options);
    expect(wrapper.find('input.recipient')).toHaveValue(address);
    expect(wrapper.find('.amount input')).toHaveValue(fields.amount.value);
    expect(wrapper.find('textarea.message')).toHaveValue(fields.reference.value);
  });

  it('should go to next step when submit button is clicked', () => {
    const { address } = accounts.genesis;
    wrapper.find('input.recipient').simulate('change', { target: { name: 'recipient', value: address } });
    wrapper.find('.amount input').simulate('change', { target: { name: 'amount', value: '12' } });
    jest.advanceTimersByTime(310);
    wrapper.update();
    expect(wrapper.find('button.btn-submit')).not.toBeDisabled();
    wrapper.find('button.btn-submit').simulate('click');
    expect(props.nextStep).toHaveBeenCalled();
  });

  describe('shold work with props.token BTC', () => {
    const dynamicFees = {
      Low: 156,
      High: 51,
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

    it('should update processingSpeed fee when "High" is selected', () => {
      wrapper.setProps({
        token: tokenMap.BTC.key,
        dynamicFees,
      });
      wrapper.find('.amount input').simulate('change', { target: { name: 'amount', value: '0.0012' } });
      expect(wrapper.find('div.processing-speed')).toIncludeText(fromRawLsk(dynamicFees.Low));
      wrapper.find('label.option-High input[type="radio"]').simulate('click').simulate('change');
      expect(wrapper.find('div.processing-speed')).toIncludeText(fromRawLsk(dynamicFees.High));
    });
  });

  describe('Recipient field', () => {
    it('should validate bookmark', () => {
      const evt = { target: { name: 'recipient', value: '123456L' } };
      wrapper.find('input.recipient').simulate('change', evt);
      jest.advanceTimersByTime(300);
      wrapper.update();
      expect(wrapper.find('.fieldGroup').at(0)).not.toHaveClassName('error');
    });

    it('should validate address', () => {
      wrapper = mount(<Form {...{
        ...props,
        bookmarks: { LSK: [] },
      }}
      />, options);
      const evt = { target: { name: 'recipient', value: '123456l' } };
      wrapper.find('input.recipient').simulate('change', evt);
      jest.advanceTimersByTime(300);
      wrapper.update();
      expect(wrapper.find('.fieldGroup').at(0)).not.toHaveClassName('error');
    });

    it('Should show bookmark title if address is a bookmark', () => {
      wrapper = mount(<Form {...{
        ...props,
        history: {
          ...props.history,
          location: {
            ...props.history.location,
            search: `?recipient=${bookmarks.LSK[0].address}`,
          },
        },
      }}
      />, options);
      expect(wrapper.find('input.recipient')).toHaveValue(bookmarks.LSK[0].title);
    });
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
