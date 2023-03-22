import { act } from 'react-dom/test-utils';
import { mountWithCustomRouterAndStore } from 'src/utils/testHelpers';
import { getTransactionBaseFees } from '@transaction/api';
import { tokenMap } from '@token/fungible/consts/tokens';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import { truncateAddress } from '@wallet/utils/account';
import * as hwManager from '@transaction/utils/hwManager';
import accounts from '@tests/constants/wallets';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import { mockAuth } from '@auth/__fixtures__';
import { useAuth } from '@auth/hooks/queries';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useCommandSchema } from '@network/hooks';
import { useGetInitializationFees, useTokensBalance } from '@token/fungible/hooks/queries';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import Summary from '.';

const mockedCurrentAccount = mockSavedAccounts[0];

jest.mock('@auth/hooks/queries/useAuth');
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

jest.mock('@transaction/api');
jest.mock('@network/hooks/useCommandsSchema');
jest.mock('@transaction/utils/hwManager');
jest.mock('@token/fungible/hooks/queries');

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

useCommandSchema.mockReturnValue({
  moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
    (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
    {}
  ),
});
useTokensBalance.mockReturnValue({ data: mockAppsTokens, isLoading: false });
useGetInitializationFees.mockReturnValue({ data: { data: { userAccount: 5000000 } } });

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
    history: {
      goBack: jest.fn(),
    },
    t: (key) => key,
    wallet: wallet.info.LSK,
    token,
    network,
    balanceReclaimed: jest.fn(),
    selectedPriority: { title: 'Normal', value: 1 },
  };

  useAuth.mockReturnValue({ data: mockAuth });

  it('should render summary component', () => {
    // Arrange
    const wrapper = mountWithCustomRouterAndStore(Summary, props, state);

    // Act
    const html = wrapper.html();

    // Assert
    expect(html).toContain(accounts.non_migrated.legacy.address);
    expect(html).toContain(truncateAddress(accounts.non_migrated.summary.address, 'medium'));
    expect(html).toContain('136 LSK');
    expect(wrapper).toContainMatchingElement('.tx-fee-section');
    expect(html).toContain('confirm-button');
  });

  it('should navigate to next page when continue button is clicked', async () => {
    // Arrange
    const wrapper = mountWithCustomRouterAndStore(Summary, props, state);
    wrapper.find('button.confirm-button').simulate('click');

    // Act
    await flushPromises();
    act(() => {
      wrapper.update();
    });

    // Assert
    expect(props.nextStep).toBeCalledWith({
      formProps: {
        moduleCommand: 'legacy:reclaimLSK',
      },
      transactionJSON: {
        module: 'legacy',
        command: 'reclaimLSK',
        params: {
          amount: accounts.non_migrated.legacy.balance,
        },
        senderPublicKey: accounts.non_migrated.summary.publicKey,
        fee: '5145764',
        id: '',
        nonce: accounts.non_migrated.sequence.nonce,
        signatures: [],
      },
      actionFunction: props.balanceReclaimed,
    });
  });

  it('should navigate to previous page when cancel button is clicked', async () => {
    // Arrange
    const wrapper = mountWithCustomRouterAndStore(Summary, props, state);
    wrapper.find('button.cancel-button').simulate('click');

    // Act
    await flushPromises();
    act(() => {
      wrapper.update();
    });

    // Assert
    expect(props.history.goBack).toBeCalledTimes(1);
  });
});
