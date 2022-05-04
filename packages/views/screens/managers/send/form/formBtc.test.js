import { act } from 'react-dom/test-utils';
import React from 'react';
import { mount } from 'enzyme';
import { tokenMap } from '@token/fungible/consts/tokens';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import {
  getUnspentTransactionOutputs,
  getTransactionFeeFromUnspentOutputs,
  getTransactionFee,
  getTransactionBaseFees,
} from '@transaction/api';
import accounts from '@tests/constants/wallets';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import Form from './formBtc';

jest.mock('@transaction/api');

const unspendTransactionOutputs = [{
  height: 1575216,
  tx_hash: '992545eeab2ac01adf78454f8b49d042efd53ab690d76121ebd3cddca3b600e5',
  tx_pos: 0,
  value: 413,
}, {
  height: 1575216,
  tx_hash: '992545eeab2ac01adf78454f8b49d042efd53ab690d76121ebd3cddca3b600e5',
  tx_pos: 1,
  value: 12299844,
}];
const balance = unspendTransactionOutputs[0].value + unspendTransactionOutputs[1].value;

getUnspentTransactionOutputs.mockResolvedValue(unspendTransactionOutputs);
getTransactionFeeFromUnspentOutputs.mockImplementation(
  ({ feePerByte }) => feePerByte,
);

const transactionBaseFees = {
  Low: 156,
  Medium: 100,
  High: 51,
};

const mockFeeFactor = 100;

getTransactionBaseFees.mockResolvedValue(transactionBaseFees);
getTransactionFee.mockImplementation((params) => {
  const selectedTransactionPriority = params.selectedPriority.selectedIndex;
  const fees = fromRawLsk(
    Object.values(transactionBaseFees)[selectedTransactionPriority] * mockFeeFactor,
  );
  return ({
    value: fees, feedback: '', error: false,
  });
});

describe('FormBtc', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      token: tokenMap.BTC.key,
      t: v => v,
      account: {
        balance,
        info: {
          LSK: accounts.genesis,
          BTC: {
            address: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
          },
        },
      },
      bookmarks: {
        LSK: [],
        BTC: [],
      },
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
      getInitialValue: key => ({ amount: 0.11, recipient: 'n3aZt7uZhnBeC9quq6btKyC8qXvskEiE1B' }[key]),
    };

    wrapper = mount(<Form {...props} />);
  });

  describe('should work with props.token BTC', () => {
    it('should re-render properly if props.token', () => {
      expect(wrapper).toContainMatchingElement('span.recipient');
      expect(wrapper).toContainMatchingElement('span.amount');
      expect(wrapper).toContainMatchingElement('div.transaction-priority');
      expect(wrapper).not.toContainMatchingElement('label.reference');
    });

    it('should update transaction priority fee when "High" is selected', async () => {
      wrapper.find('.amount input').simulate('change', { target: { name: 'amount', value: '0.0012' } });
      expect(wrapper.find('div.transaction-priority')).toIncludeText(fromRawLsk(transactionBaseFees.Low * mockFeeFactor));
      wrapper.find('button.option-High').simulate('click');
      await flushPromises();
      expect(wrapper.find('div.transaction-priority')).toIncludeText(fromRawLsk(transactionBaseFees.High * mockFeeFactor));
    });

    it.skip('should allow to set entire balance', async () => {
      wrapper.find('button.use-entire-balance-button').simulate('click');
      act(() => { jest.runAllTimers(); });
      wrapper.update();
      await flushPromises();
      expect(wrapper.find('.amount input').prop('value')).toEqual(fromRawLsk(balance - (transactionBaseFees.Low * mockFeeFactor)));
    });
  });
});
