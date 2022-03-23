import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import {
  getTransactionBaseFees,
} from '@transaction/api';
import { tokenMap } from '@common/configuration';
import useTransactionFeeCalculation from '@shared/transactionPriority/useTransactionFeeCalculation';
import { truncateAddress } from '@common/utilities/account';
import * as hwManagerAPI from '@common/utilities/hwManager';
import accounts from '../../../../../../test/constants/accounts';
import Summary from './summary';
import flushPromises from '../../../../../../test/unit-test-utils/flushPromises';

jest.mock('@shared/transactionPriority/useTransactionFeeCalculation');
jest.mock('@transaction/api');
jest.mock('@common/utilities/hwManager');

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
hwManagerAPI.signTransactionByHW.mockResolvedValue(response);
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
