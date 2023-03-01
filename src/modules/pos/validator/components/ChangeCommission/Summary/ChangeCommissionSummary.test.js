import React from 'react';
import { fireEvent } from '@testing-library/react';
import TransactionSummary from '@transaction/manager/transactionSummary';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import ChangeCommissionSummary from './ChangeCommissionSummary';

jest.mock('@transaction/manager/transactionSummary', () =>
  jest.fn(({ confirmButton, cancelButton }) => (
    <div>
      <button data-testid="confirm" onClick={confirmButton.onClick}>
        {confirmButton.label}
      </button>
      <button data-testid="cancel" onClick={cancelButton.onClick}>
        {cancelButton.label}
      </button>
    </div>
  ))
);

describe('ChangeCommissionSummary', () => {
  const nextStep = jest.fn();
  const prevStep = jest.fn();
  const validatorRegistered = {};
  const formProps = {
    params: {
      newCommission: 1000,
    },
    moduleCommand: 'pos:unlock',
  };
  const transactionJSON = {
    fee: '0',
    nonce: '1',
    module: 'pos',
    command: 'changeCommission',
  };
  const selectedPriority = { title: 'Normal', selectedIndex: 0, value: 0 };
  const fees = [];
  const props = {
    validatorRegistered,
    formProps,
    transactionJSON,
    prevStep,
    nextStep,
    selectedPriority,
    fees,
  };
  it('should pass correct props to transaction summary', async () => {
    renderWithRouterAndQueryClient(ChangeCommissionSummary, props);
    expect(TransactionSummary).toHaveBeenCalledWith(
      expect.objectContaining({
        formProps,
        transactionJSON,
        selectedPriority,
        fees,
      }),
      expect.anything()
    );
  });

  it('should call the onConfirmAction when the confirm button is clicked', async () => {
    const { getByTestId } = renderWithRouterAndQueryClient(ChangeCommissionSummary, props);
    const confirmButton = getByTestId('confirm');

    fireEvent.click(confirmButton);
    expect(nextStep).toHaveBeenCalledWith({
      formProps,
      transactionJSON,
      actionFunction: validatorRegistered,
    });
    expect(confirmButton.textContent).toBe('Confirm');
  });

  it('should display the correct label text for the cancel button', () => {
    const { getByTestId } = renderWithRouterAndQueryClient(ChangeCommissionSummary, props);
    const cancelButton = getByTestId('cancel');

    fireEvent.click(cancelButton);
    expect(prevStep).toHaveBeenCalledWith({ formProps, transactionJSON });
    expect(cancelButton.textContent).toBe('Go back');
  });
});
