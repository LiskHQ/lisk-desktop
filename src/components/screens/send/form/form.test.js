import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { tokenMap } from '../../../../constants/tokens';
import Form from './form';
import accounts from '../../../../../test/constants/accounts';
import flushPromises from '../../../../../test/unit-test-utils/flushPromises';
import { getTransactionBaseFees } from '../../../../utils/api/lsk/transactions';

jest.mock('../../../../utils/api/lsk/transactions');

getTransactionBaseFees.mockResolvedValue({
  Low: 156,
  Medium: 100,
  High: 51,
});

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
        ...accounts.genesis,
        nonce: '1',
        balance: '5000000000',
      },
      bookmarks,
      network: {
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
      initialValue: {
        recipient: bookmarks.LSK[0].address,
      },
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

  it('should go to next step when submit button is clicked', async () => {
    const { address } = accounts.genesis;
    wrapper.find('input.recipient').simulate('change', { target: { name: 'recipient', value: address } });
    wrapper.find('.amount input').simulate('change', { target: { name: 'amount', value: '12' } });
    act(() => { jest.advanceTimersByTime(300); });

    act(() => { wrapper.update(); });
    await flushPromises();

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

    it('Should show error feedback if wrong data is inserted', async () => {
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
      await flushPromises();
      wrapper.update();
      expect(wrapper.find('.amount Feedback')).toHaveText('Provided amount is higher than your current balance.');
    });

    it('Should show error if transaction will result on an account with less than the minimum balance', () => {
      const evt = { target: { name: 'amount', value: '49.96' } };
      const amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      expect(wrapper.find('.amount Feedback')).toHaveText('Provided amount will result in a wallet with less than the minimum balance.');
      expect(wrapper.find('button.btn-submit')).toBeDisabled();
    });

    it('Should be able to send entire balance', () => {
      const { address } = accounts.genesis;
      wrapper.find('.send-entire-balance-button').at(1).simulate('click');
      wrapper.find('input.recipient').simulate('change', { target: { name: 'recipient', value: address } });
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      expect(wrapper.find('.amount Feedback')).toHaveText('');
      expect(wrapper.find('button.btn-submit')).not.toBeDisabled();
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

  describe('Custom fee', () => {
    it('Should disable confirmation button when fee is higher than hard cap', async () => {
      const { address } = accounts.genesis;
      wrapper.find('input.recipient').simulate('change', { target: { name: 'recipient', value: address } });
      wrapper.find('.amount input').simulate('change', { target: { name: 'amount', value: '12' } });
      wrapper.find('.option-Custom').simulate('click');
      wrapper.find('.custom-fee-input').at(1).simulate('change', { target: { name: 'amount', value: '0.5' } });
      act(() => { jest.advanceTimersByTime(300); });

      act(() => { wrapper.update(); });
      await flushPromises();

      expect(wrapper.find('button.btn-submit')).toBeDisabled();
    });

    it('Should disable confirmation button when fee is less than the minimum', async () => {
      const { address } = accounts.genesis;
      wrapper.find('input.recipient').simulate('change', { target: { name: 'recipient', value: address } });
      wrapper.find('.amount input').simulate('change', { target: { name: 'amount', value: '12' } });
      wrapper.find('.option-Custom').simulate('click');
      wrapper.find('.custom-fee-input').at(1).simulate('change', { target: { name: 'amount', value: '0.00000000001' } });
      act(() => { jest.advanceTimersByTime(300); });

      act(() => { wrapper.update(); });
      await flushPromises();

      expect(wrapper.find('button.btn-submit')).toBeDisabled();
    });

    it('Should enable confirmation button when fee within bounds', async () => {
      const { address } = accounts.genesis;
      wrapper.find('input.recipient').simulate('change', { target: { name: 'recipient', value: address } });
      wrapper.find('.amount input').simulate('change', { target: { name: 'amount', value: '12' } });
      wrapper.find('.option-Custom').simulate('click');
      wrapper.find('.custom-fee-input').at(1).simulate('change', { target: { name: 'amount', value: '0.019' } });
      act(() => { jest.advanceTimersByTime(300); });

      act(() => { wrapper.update(); });
      await flushPromises();

      expect(wrapper.find('button.btn-submit')).not.toBeDisabled();
    });
  });
});
