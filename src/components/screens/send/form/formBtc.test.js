import { act } from 'react-dom/test-utils';
import React from 'react';
import { mount } from 'enzyme';
import { fromRawLsk } from '../../../../utils/lsk';
import {
  getUnspentTransactionOutputs,
  getTransactionFeeFromUnspentOutputs,
  getDynamicFee,
  getDynamicBaseFees,
} from '../../../../utils/api/btc/transactions';
import { tokenMap } from '../../../../constants/tokens';
import Form from './formBtc';
import accounts from '../../../../../test/constants/accounts';
import * as serviceActions from '../../../../actions/service';
import flushPromises from '../../../../../test/unit-test-utils/flushPromises';

jest.mock('../../../../utils/api/btc/transactions');

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
  ({ dynamicFeePerByte }) => dynamicFeePerByte,
);

const dynamicBaseFees = {
  Low: 156,
  Medium: 100,
  High: 51,
};

const dynamicFeeFactor = 100;

getDynamicBaseFees.mockResolvedValue(dynamicBaseFees);
getDynamicFee.mockImplementation((params) => {
  const selectedProcessingSpeed = params.dynamicFeePerByte.selectedIndex;
  const fees = fromRawLsk(
    Object.values(dynamicBaseFees)[selectedProcessingSpeed] * dynamicFeeFactor,
  );
  return ({
    value: fees, feedback: '', error: false,
  });
});

describe('FormBtc', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    jest.spyOn(serviceActions, 'dynamicFeesRetrieved');

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
      getInitialValue: key => ({ amount: 0.11, recipient: 'n3aZt7uZhnBeC9quq6btKyC8qXvskEiE1B' }[key]),
    };

    wrapper = mount(<Form {...props} />);
  });

  describe('should work with props.token BTC', () => {
    it('should re-render properly if props.token', () => {
      expect(wrapper).toContainMatchingElement('span.recipient');
      expect(wrapper).toContainMatchingElement('span.amount');
      expect(wrapper).toContainMatchingElement('div.processing-speed');
      expect(wrapper).not.toContainMatchingElement('label.reference');
    });

    it('should update processingSpeed fee when "High" is selected', async () => {
      wrapper.find('.amount input').simulate('change', { target: { name: 'amount', value: '0.0012' } });
      expect(wrapper.find('div.processing-speed')).toIncludeText(fromRawLsk(dynamicBaseFees.Low * dynamicFeeFactor));
      wrapper.find('button.option-High').simulate('click');
      await flushPromises();
      expect(wrapper.find('div.processing-speed')).toIncludeText(fromRawLsk(dynamicBaseFees.High * dynamicFeeFactor));
    });

    it('should allow to set entire balance', async () => {
      wrapper.find('button.send-entire-balance-button').simulate('click');
      act(() => { jest.runAllTimers(); });
      wrapper.update();
      await flushPromises();
      expect(wrapper.find('.amount input').prop('value')).toEqual(fromRawLsk(balance - (dynamicBaseFees.Low * dynamicFeeFactor)));
    });
  });
});
