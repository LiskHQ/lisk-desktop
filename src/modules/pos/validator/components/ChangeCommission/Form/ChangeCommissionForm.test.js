import { fireEvent } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { ChangeCommissionForm } from './ChangeCommissionForm';

jest.useRealTimers();

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
      const value = '0.10';
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
    it('passing valid parameters on submit', async () => {
      const { getByTestId, getByText } = renderWithRouterAndQueryClient(
        ChangeCommissionForm,
        props
      );
      const value = '0.10';
      const button = getByText(buttonText);
      const input = getByTestId('newCommission');
      fireEvent.change(input, { target: { value } });
      fireEvent.click(button);
      expect(nextStep).toHaveBeenCalledWith(
        expect.objectContaining({
          formProps: expect.objectContaining({
            fields: { newCommission: '0.10' },
            isFormValid: true,
            moduleCommand: 'pos:changeCommission',
            params: { newCommission: 10 }
          }),
          transactionJSON: expect.objectContaining({
            command: 'changeCommission',
            module: 'pos',
            params: { newCommission: 10 },
          })
        })
      );
    });
  });
});
