import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { useTransactionEstimateFees } from '@transaction/hooks/queries/useTransactionEstimateFees';
import useSettings from '@settings/hooks/useSettings';
import * as transactionApi from '@transaction/api';
import { usePosConstants } from '@pos/validator/hooks/queries/usePosConstants';
import { mockPosConstants } from '@pos/validator/__fixtures__/mockPosConstants';
import { useAuth } from '@auth/hooks/queries/useAuth';
import { mockAuth } from 'src/modules/auth/__fixtures__';
import { ChangeCommissionForm } from './ChangeCommissionForm';

const mockEstimateFeeResponse = {
  data: {
    transaction: {
      fee: {
        tokenID: '0400000000000000',
        minimum: '5104000',
      },
    },
  },
  meta: {
    breakdown: {
      fee: {
        minimum: {
          byteFee: '96000',
          additionalFees: {},
        },
      },
    },
  },
};

jest.useRealTimers();

jest.mock('@auth/hooks/queries/useAuth');
jest.mock('@token/fungible/hooks/queries/useTokenBalances', () => ({
  useTokenBalances: jest.fn(() => ({
    data: { data: [{ chainID: '04000000', symbol: 'LSK', availableBalance: 40000000 }] },
  })),
}));

jest.mock('@pos/validator/hooks/useCurrentCommissionPercentage', () => ({
  useCurrentCommissionPercentage: jest.fn(() => ({
    currentCommission: '90.00',
    isLoading: false,
    isSuccess: true,
  })),
}));
jest.mock('@transaction/hooks/queries/useTransactionEstimateFees');
jest.mock('@settings/hooks/useSettings');
jest.spyOn(transactionApi, 'dryRun').mockResolvedValue([]);
jest.mock('@pos/validator/hooks/queries/usePosConstants');

describe('ChangeCommissionForm', () => {
  const nextStep = jest.fn();
  const props = {
    prevState: {},
    nextStep,
  };
  const buttonText = 'Confirm';

  usePosConstants.mockReturnValue({ data: mockPosConstants });
  useSettings.mockReturnValue({
    mainChainNetwork: { name: 'devnet' },
    toggleSetting: jest.fn(),
  });
  useTransactionEstimateFees.mockReturnValue({
    data: mockEstimateFeeResponse,
    isFetching: false,
    isFetched: true,
    error: false,
  });
  useAuth.mockReturnValue({ data: mockAuth });

  describe('Renders correctly', () => {
    it('renders properly ChangeCommissionForm component', () => {
      const { getByText } = renderWithRouterAndQueryClient(ChangeCommissionForm, props);
      const button = getByText(buttonText);
      expect(button.closest('button').disabled).toBeTruthy();
    });

    it('set change commission', async () => {
      const { getByTestId, getByText } = renderWithRouterAndQueryClient(
        ChangeCommissionForm,
        props
      );
      const value = '30.00';
      const button = getByText(buttonText);
      const input = getByTestId('newCommission');
      fireEvent.change(input, { target: { value } });
      fireEvent.click(button);

      waitFor(() => {
        expect(button.closest('button').disabled).not.toBeTruthy();
        expect(nextStep).toHaveBeenCalledTimes(1);
      });
    });

    it('wrong commission should not submit', async () => {
      const { getByTestId, getByText } = renderWithRouterAndQueryClient(
        ChangeCommissionForm,
        props
      );
      const value = '101.00';
      const button = getByText(buttonText);
      const input = getByTestId('newCommission');
      fireEvent.change(input, { target: { value } });
      expect(button.closest('button').disabled).toBeTruthy();
    });

    it('should not allow negative commissions to submit', async () => {
      const { getByTestId, getByText } = renderWithRouterAndQueryClient(
        ChangeCommissionForm,
        props
      );
      const value = '-1';
      const button = getByText(buttonText);
      const input = getByTestId('newCommission');
      fireEvent.change(input, { target: { value } });
      expect(button.closest('button').disabled).toBeTruthy();
      expect(screen.getByText('Commission range is invalid')).toBeTruthy();
    });

    it('should not pass when commission increases more than 5%', async () => {
      const { getByTestId, getByText } = renderWithRouterAndQueryClient(
        ChangeCommissionForm,
        props
      );
      const value = '96';
      const button = getByText(buttonText);
      const input = getByTestId('newCommission');
      fireEvent.change(input, { target: { value } });
      expect(button.closest('button').disabled).toBeTruthy();
      expect(screen.getByText('You cannot increase commission more than 5%')).toBeTruthy();
    });

    it('should not pass when new commission have more than 2 decimal places', async () => {
      const { getByTestId, getByText } = renderWithRouterAndQueryClient(
        ChangeCommissionForm,
        props
      );
      const value = '89.0101';
      const button = getByText(buttonText);
      const input = getByTestId('newCommission');
      fireEvent.change(input, { target: { value } });
      expect(screen.getByText('Input decimal places limited to 2')).toBeTruthy();
      expect(button.closest('button').disabled).toBeTruthy();
    });

    it('passes valid parameters on submit', async () => {
      const { getByTestId, getByText } = renderWithRouterAndQueryClient(
        ChangeCommissionForm,
        props
      );
      const value = '30.00';
      const button = getByText(buttonText);
      const input = getByTestId('newCommission');
      fireEvent.change(input, { target: { value } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(nextStep).toHaveBeenCalledWith(
          expect.objectContaining({
            fees: [
              {
                components: [{ type: 'bytesFee', value: 96000n }],
                title: 'Transaction',
                value: '0 LSK',
              },
              { components: [], isHidden: true, title: 'Message', value: '0 LSK' },
            ],
            formProps: {
              composedFees: [
                {
                  components: [{ type: 'bytesFee', value: 96000n }],
                  title: 'Transaction',
                  value: '0 LSK',
                },
                { components: [], isHidden: true, title: 'Message', value: '0 LSK' },
              ],
              fields: {
                newCommission: '30.00',
                token: { availableBalance: 40000000, chainID: '04000000', symbol: 'LSK' },
              },
              isFormValid: true,
              moduleCommand: 'pos:changeCommission',
              params: { newCommission: 3000 },
            },
            selectedPriority: { selectedIndex: 0, title: 'Normal', value: 0 },
            transactionJSON: {
              command: 'changeCommission',
              fee: '5104000',
              module: 'pos',
              nonce: '0',
              params: { newCommission: 3000 },
              senderPublicKey: 'cf434a889d6c7a064e8de61bb01759a76f585e5ff45a78ba8126ca332601f535',
              signatures: [],
            },
          })
        );
      });
    });
  });
});
