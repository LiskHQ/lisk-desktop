import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { tokenMap } from '../../../../../constants/tokens';
import Form from './form';
import accounts from '../../../../../../test/constants/accounts';

describe('Form', () => {
  let wrapper;
  let props;
  let bookmarks;
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
    act(() => { jest.advanceTimersByTime(300); });
    wrapper.update();
    expect(wrapper.find('button.btn-submit')).not.toBeDisabled();
    wrapper.find('button.btn-submit').simulate('click');
    expect(props.nextStep).toHaveBeenCalled();
  });

  describe('Recipient field', () => {
    it('should validate bookmark', () => {
      const evt = { target: { name: 'recipient', value: '123456L' } };
      wrapper.find('input.recipient').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
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
      act(() => { jest.advanceTimersByTime(300); });
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
      amountField.find('input').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField).toContainMatchingElement('.converted-price');
    });

    it('Should add leading 0 if . is inserted as first character', () => {
      const evt = { target: { name: 'amount', value: '.1' } };
      let amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField.find('input').prop('value')).toEqual('0.1');
    });

    it('Should show error feedback if wrong data is inserted', () => {
      let amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', { target: { name: 'amount', value: 'abc' } });
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField.find('.feedback.error')).toHaveClassName('error');
      expect(wrapper.find('.amount Feedback')).toHaveText('Provide a correct amount of LSK');

      amountField.find('input').simulate('change', { target: { name: 'amount', value: '1.1.' } });
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);
      expect(amountField.find('.feedback.error')).toHaveClassName('error');
      expect(wrapper.find('.amount Feedback')).toHaveText('Provide a correct amount of LSK');

      amountField.find('input').simulate('change', { target: { name: 'amount', value: props.account.balance + 2 } });
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      expect(wrapper.find('.amount Feedback')).toHaveText('Provided amount is higher than your current balance.');
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
      referenceField.find('AutoResizeTextarea').simulate('focus');
      referenceField.find('AutoResizeTextarea').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      referenceField = wrapper.find('.fieldGroup').at(2);
      expect(referenceField.find('.feedback.error')).toHaveClassName('show error');
    });
  });
});
