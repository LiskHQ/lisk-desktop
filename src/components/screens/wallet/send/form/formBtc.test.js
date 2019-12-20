import { act } from 'react-dom/test-utils';
import { useSelector } from 'react-redux';
import React from 'react';
import { mount } from 'enzyme';
import { fromRawLsk } from '../../../../../utils/lsk';
import {
  getUnspentTransactionOutputs,
  getTransactionFeeFromUnspentOutputs,
} from '../../../../../utils/api/btc/transactions';
import {
  getDynamicFees,
} from '../../../../../utils/api/btc/service';
import { tokenMap } from '../../../../../constants/tokens';
import Form from './form';
import accounts from '../../../../../../test/constants/accounts';
import defaultState from '../../../../../../test/constants/defaultState';
import * as serviceActions from '../../../../../actions/service';

jest.mock('../../../../../utils/api/btc/transactions');

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

jest.mock('../../../../../utils/api/btc/service');
const dynamicFees = {
  Low: 156,
  High: 51,
};
getDynamicFees.mockResolvedValue(dynamicFees);

describe('FormBtc', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    useSelector.mockImplementation(selectorFn => selectorFn({
      ...defaultState,
      service: { dynamicFees },
    }));
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
    };

    wrapper = mount(<Form {...props} />);
  });

  describe('shold work with props.token BTC', () => {
    it('should re-render properly if props.token', () => {
      expect(wrapper).toContainMatchingElement('span.recipient');
      expect(wrapper).toContainMatchingElement('span.amount');
      expect(wrapper).toContainMatchingElement('div.processing-speed');
      expect(wrapper).not.toContainMatchingElement('label.reference');
    });

    it('should update processingSpeed fee when "High" is selected', () => {
      wrapper.find('.amount input').simulate('change', { target: { name: 'amount', value: '0.0012' } });
      expect(wrapper.find('div.processing-speed')).toIncludeText(fromRawLsk(dynamicFees.Low));
      wrapper.find('label.option-High input[type="radio"]').simulate('click').simulate('change');
      expect(wrapper.find('div.processing-speed')).toIncludeText(fromRawLsk(dynamicFees.High));
    });

    it('should allow to set entire balance', () => {
      wrapper.find('button.send-entire-balance-button').simulate('click');
      act(() => { jest.runAllTimers(); });
      wrapper.update();
      expect(wrapper.find('.amount input').prop('value')).toEqual(fromRawLsk(balance - dynamicFees.Low));
    });
  });
});
