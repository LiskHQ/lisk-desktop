import { act } from 'react-dom/test-utils';
import { mountWithProps } from 'src/utils/testHelpers';
import {
  getTransactionBaseFees,
} from '@transaction/api';
import { tokenMap } from '@token/fungible/consts/tokens';
import useTransactionFeeCalculation from '@transaction/hooks/useTransactionFeeCalculation';
import { truncateAddress } from '@wallet/utils/account';
import * as hwManager from '@transaction/utils/hwManager';
import accounts from '@tests/constants/wallets';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import Summary from '.';

jest.mock('@transaction/hooks/useTransactionFeeCalculation');
jest.mock('@transaction/api');
jest.mock('@transaction/utils/hwManager');

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
  const wallet = { info: { LSK: accounts.non_migrated } };
  const token = { active: tokenMap.LSK.key };
  const network = { networks: { LSK: { networkIdentifier: 'sample_identifier' } } };
  const state = {
    wallet,
    token,
    network,
  };
  const props = {
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    t: key => key,
    wallet: wallet.info.LSK,
    token,
    network,
    balanceReclaimed: jest.fn(),
    selectedPriority: { title: 'Normal', value: 1 },
    fees: {
      Transaction: '0.001 LSK',
      CCM: '1 LSK',
      initiation: '1 LSK',
    },
  };

  it('should render summary component', () => {
    // Arrange
    const wrapper = mountWithProps(Summary, props, state);

    // Act
    const html = wrapper.html();

    // Assert
    expect(html).toContain(accounts.non_migrated.legacy.address);
    expect(html).toContain(truncateAddress(accounts.non_migrated.summary.address, 'medium'));
    expect(html).toContain('136 LSK');
    expect(wrapper).toContainMatchingElement('.fee-value-Transaction');
    expect(html).toContain('confirm-button');
  });

  it('should navigate to next page when continue button is clicked', async () => {
    // Arrange
    const wrapper = mountWithProps(Summary, props, state);
    wrapper.find('button.confirm-button').simulate('click');

    // Act
    await flushPromises();
    act(() => { wrapper.update(); });

    // Assert
    expect(props.nextStep).toBeCalledWith({
      rawTx: {
        params: {
          amount: accounts.non_migrated.legacy.balance,
        },
        fee: 100000,
        moduleCommandID: '1000:0',
        nonce: accounts.non_migrated.sequence.nonce,
        sender: {
          PublicKey: accounts.non_migrated.summary.publicKey,
        },
      },
      actionFunction: props.balanceReclaimed,
    });
  });
});
