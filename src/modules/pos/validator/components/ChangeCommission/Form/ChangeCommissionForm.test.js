import { fireEvent } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { ChangeCommissionForm } from './ChangeCommissionForm';

jest.useRealTimers();

jest.mock('@token/fungible/hooks/queries/useTokenBalances', () => ({
  useTokenBalances: jest.fn(() => ({ data: { data: [{ chainID: '04000000', symbol: 'LSK' }] } })),
}));

jest.mock('@pos/validator/hooks/useCurrentCommissionPercentage', () => ({
  useCurrentCommissionPercentage: jest.fn(() => ({
    currentCommission: '90.00',
    isLoading: false,
    isSuccess: true,
  })),
}));

describe('ChangeCommissionForm', () => {
  const nextStep = jest.fn();
  const props = {
    prevState: {},
    nextStep,
  };
  const buttonText = 'Confirm';

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
      expect(button.closest('button').disabled).not.toBeTruthy();
      expect(nextStep).toHaveBeenCalledTimes(1);
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
      expect(nextStep).toHaveBeenCalledWith(
        expect.objectContaining({
          formProps: expect.objectContaining({
            fields: { newCommission: '30.00', token: { chainID: '04000000', symbol: 'LSK' } },
            isFormValid: true,
            moduleCommand: 'pos:changeCommission',
            params: { newCommission: 3000 },
          }),
          transactionJSON: expect.objectContaining({
            command: 'changeCommission',
            module: 'pos',
            params: { newCommission: 3000 },
          }),
        })
      );
    });
  });
});
