import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { tokenMap } from '@token/fungible/consts/tokens';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import accounts from '@tests/constants/wallets';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import Form from './SendForm';

jest.mock('@transaction/hooks/useTransactionFeeCalculation', () => jest.fn().mockReturnValue({
  minFee: { value: 0.00001 },
  fee: { value: 0.0001 },
  maxAmount: { value: 200000000 },
}));

describe('Form', () => {
  let props;
  let bookmarks;

  beforeEach(() => {
    bookmarks = {
      LSK: [{
        title: 'ABC',
        address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
      }, {
        title: 'FRG',
        address: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
      }, {
        title: 'KTG',
        address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
      }],
    };

    props = {
      t: v => v,
      token: tokenMap.LSK.key,
      account: {
        ...accounts.genesis,
        token: { balance: '200000000' },
      },
      bookmarks,
      nextStep: jest.fn(),
      initialValue: {},
    };
  });

  it('should render properly', () => {
    const wrapper = mount(<Form {...props} />);
    expect(wrapper).toContainMatchingElement('span.recipient');
    expect(wrapper).toContainMatchingElement('span.amount');
    // TODO: this would be re-evaluated in the send token implementation
    // expect(wrapper).toContainMatchingElement('label.reference');
    expect(wrapper).not.toContainMatchingElement('PrimaryButton.btn-submit');
  });

  it('should render properly with data from prevState', () => {
    const { address } = accounts.genesis.summary;
    const rawTx = {
      params: {
        recipient: {
          address, value: address, error: false, feedback: '', title: '',
        },
        amount: 1000000000,
        data: 'message',
      },
    };
    const wrapper = mount(<Form {...{
      ...props,
      prevState: { rawTx },
    }}
    />);
    expect(wrapper.find('input.recipient')).toHaveValue(address);
    expect(wrapper.find('.amount input')).toHaveValue(fromRawLsk(rawTx.params.amount));
    expect(wrapper.find('textarea.message')).toHaveValue(rawTx.params.data);
  });

  it('should go to next step when submit button is clicked', async () => {
    const wrapper = mount(<Form {...props} />);
    const { address } = accounts.genesis.summary;
    wrapper.find('input.recipient').simulate('change', { target: { name: 'recipient', value: address } });
    wrapper.find('.amount input').simulate('change', { target: { name: 'amount', value: '1' } });
    act(() => { jest.advanceTimersByTime(300); });

    act(() => { wrapper.update(); });
    await flushPromises();

    expect(wrapper.find('.confirm-btn').at(0)).not.toBeDisabled();
    wrapper.find('.confirm-btn').at(0).simulate('click');
    expect(props.nextStep).toHaveBeenCalled();
  });

  describe('Recipient field', () => {
    it('should validate bookmark', () => {
      const wrapper = mount(<Form {...props} />);
      const evt = { target: { name: 'recipient', value: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6' } };
      wrapper.find('input.recipient').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      expect(wrapper.find('.feedback').at(0)).not.toHaveClassName('error');
    });

    it('should validate address', () => {
      const wrapper = mount(<Form {...{
        ...props,
        bookmarks: { LSK: [] },
      }}
      />);
      const evt = { target: { name: 'recipient', value: 'invalid_address' } };
      wrapper.find('input.recipient').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      expect(wrapper.find('.feedback').at(0)).toHaveClassName('error');
    });

    it('Should show bookmark title if address is a bookmark', () => {
      const wrapper = mount(<Form {...props} />);
      const receipientEvt = { target: { name: 'recipient', value: bookmarks.LSK[0].address } };
      wrapper.find('input.recipient').simulate('change', receipientEvt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      expect(wrapper.find('input.recipient')).toHaveValue(bookmarks.LSK[0].title);
    });
  });

  describe('Amount field', () => {
    it('Should show converter on correct input', () => {
      const wrapper = mount(<Form {...props} />);
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
      const wrapper = mount(<Form {...props} />);
      const evt = { target: { name: 'amount', value: '.1' } };
      let amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);

      expect(amountField.find('input').prop('value')).toEqual('0.1');
    });

    it('Should show error feedback if wrong data is inserted', async () => {
      const wrapper = mount(<Form {...props} />);
      let amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', { target: { name: 'amount', value: 'abc' } });
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(1);

      expect(amountField.find('.feedback.error')).toHaveClassName('error');
      expect(wrapper.find('.amount Feedback')).toHaveText('Provide a correct amount of LSK');

      // TODO: this would be re-evaluated  in the send token implementation
      // amountField.find('input').simulate('change',
      //   { target: { name: 'amount', value: '1.1.' } });
      // act(() => { jest.advanceTimersByTime(300); });
      // wrapper.update();
      // amountField = wrapper.find('.fieldGroup').at(1);

      // expect(amountField.find('.feedback.error')).toHaveClassName('error');
      // expect(wrapper.find('.amount Feedback')).toHaveText('Provide a correct amount of LSK');

      // amountField.find('input').simulate('change', {
      //   target:
      //     { name: 'amount', value: props.account.token?.balance + 2 },
      // });
      // act(() => { jest.advanceTimersByTime(300); });
      // await flushPromises();
      // wrapper.update();

      // expect(wrapper.find('.amount Feedback')).toHaveText(
      //   'Provided amount is higher than your current balance.',
      // );
    });

    it('Should show error if transaction will result on an account with less than the minimum balance', () => {
      const wrapper = mount(<Form {...props} />);
      const evt = { target: { name: 'amount', value: '2.01' } };
      const amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();

      expect(wrapper.find('.amount Feedback')).toHaveText('Provided amount will result in a wallet with less than the minimum balance.');
      expect(wrapper.find('.confirm-btn').at(0)).toBeDisabled();
    });

    it('Should show error if amount is negative', () => {
      const wrapper = mount(<Form {...props} />);
      const evt = { target: { name: 'amount', value: '-1' } };
      const amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();

      expect(wrapper.find('.amount Feedback')).toHaveText('Amount can\'t be negative.');
      expect(wrapper.find('.confirm-btn').at(0)).toBeDisabled();
    });

    it('Should allow to send 0 LSK amount', () => {
      const wrapper = mount(<Form {...props} />);
      const receipientEvt = { target: { name: 'recipient', value: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6' } };
      wrapper.find('input.recipient').simulate('change', receipientEvt);
      const evt = { target: { name: 'amount', value: '0' } };
      const amountField = wrapper.find('.fieldGroup').at(1);
      amountField.find('input').simulate('change', evt);
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();

      expect(wrapper.find('.amount Feedback')).not.toHaveText(expect.any(String));
      expect(wrapper.find('.confirm-btn').at(0)).not.toBeDisabled();
    });

    it('Should be able to send entire balance', () => {
      const wrapper = mount(<Form {...props} />);
      const { address } = accounts.genesis.summary;
      wrapper.find('input.recipient').simulate('change', { target: { name: 'recipient', value: address } });
      wrapper.find('.use-entire-balance-button').at(1).simulate('click');
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();

      expect(wrapper.find('.amount Feedback')).toHaveText('');
      expect(wrapper.find('.confirm-btn').at(0)).not.toBeDisabled();
    });

    it('Should update amount field if maximum value changes', () => {
      const wrapper = mount(<Form {...props} />);
      const { address } = accounts.genesis.summary;
      wrapper.find('input.recipient').simulate('change', { target: { name: 'recipient', value: address } });
      wrapper.find('.use-entire-balance-button').at(1).simulate('click');
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      expect(wrapper.find('.amount input').instance().value).toEqual('2');
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      // TODO: this would be re-evaluated  in the send token implementation
      // wrapper.find('textarea.message')
      // .simulate('change', { target: {
      //  name: 'reference', value: 'Testing maximum balance update' } });
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();
      expect(wrapper.find('.amount input').instance().value).toEqual('2');
    });

    it('Should display send entire balance warning', () => {
      const wrapper = mount(<Form {...props} />);
      const { address } = accounts.genesis.summary;
      wrapper.find('input.recipient').simulate('change', { target: { name: 'recipient', value: address } });
      wrapper.find('.use-entire-balance-button').at(1).simulate('click');
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();

      expect(wrapper.find('.entire-balance-warning')).toHaveText('You are about to send your entire balance');
      wrapper.find('.close-entire-balance-warning').at(0).simulate('click');
      act(() => { jest.advanceTimersByTime(300); });
      wrapper.update();

      expect(wrapper.find('.entire-balance-warning'));
    });
  });

  // TODO: this would be re-evaluated  in the send token implementation
  // describe('Reference field', () => {
  //   it('Should show error feedback over limit of characters', () => {
  //     const wrapper = mount(<Form {...props} />);
  //     let referenceField = wrapper.find('.fieldGroup').at(2);
  //     const evt = {
  //       target: {
  //         name: 'reference',
  //         value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit volutpat.',
  //       },
  //     };
  //     referenceField.find('AutoResizeTextarea').simulate('focus');
  //     referenceField.find('AutoResizeTextarea').simulate('change', evt);
  //     act(() => { jest.advanceTimersByTime(300); });
  //     wrapper.update();
  //     referenceField = wrapper.find('.fieldGroup').at(2);

  //     expect(referenceField.find('.feedback.error')).toHaveClassName('show error');
  //   });
  // });
});
