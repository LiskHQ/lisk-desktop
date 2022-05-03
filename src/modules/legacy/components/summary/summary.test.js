import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import {
  getTransactionBaseFees,
} from '@transaction/utilities/api';
import { tokenMap } from '@token/fungible/consts/tokens';
import useTransactionFeeCalculation from '@transaction/manage/transactionPriority/useTransactionFeeCalculation';
import { truncateAddress } from '@wallet/utilities/account';
import * as hwManager from '@transaction/utilities/hwManager';
import accounts from '@tests/constants/wallets';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import Summary from './summary';

jest.mock('@transaction/manage/transactionPriority/useTransactionFeeCalculation');
jest.mock('@transaction/utilities/api');
jest.mock('@transaction/utilities/hwManager');

const transactionBaseFees = {
  Low: 156,
  Medium: 100,
  High: 51,
};

const response = {
  amount: 13600000000,
  nonce: '123',
  id: 'tx-id',
};

getTransactionBaseFees.mockResolvedValue(transactionBaseFees);
hwManager.signTransactionByHW.mockResolvedValue(response);
useTransactionFeeCalculation.mockImplementation(() => ({
  minFee: { value: 0.001 },
}));

describe('Reclaim balance Summary', () => {
  const props = {
    nextStep: jest.fn(),
    t: key => key,
    account: {
      passphrase: 'test',
      info: {
        LSK: accounts.non_migrated,
      },
    },
    settings: { token: tokenMap.LSK.key },
    network: {
      networks: {
        LSK: { networkIdentifier: 'sample_identifier' },
      },
    },
    balanceReclaimed: jest.fn(),
  };

  it('should render summary component', () => {
    // Arrange
    const wrapper = mount(<Summary {...props} />);

    // Act
    const html = wrapper.html();

    // Assert
    expect(html).toContain(accounts.non_migrated.legacy.address);
    expect(html).toContain(truncateAddress(accounts.non_migrated.summary.address, 'medium'));
    expect(html).toContain('136 LSK');
    expect(html).toContain('0.001 LSK');
    expect(html).toContain('confirm-button');
  });

  it('should navigate to next page when continue button is clicked', async () => {
    // Arrange
    const wrapper = mount(<Summary {...props} />);
    wrapper.find('button.confirm-button').simulate('click');

    // Act
    await flushPromises();
    act(() => { wrapper.update(); });

    // Assert
    expect(props.nextStep).toBeCalledWith({
      rawTransaction: { fee: { value: 0.001 } },
      actionFunction: props.balanceReclaimed,
    });
  });
});
