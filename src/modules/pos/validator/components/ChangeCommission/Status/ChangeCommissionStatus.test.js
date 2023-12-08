import React from 'react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { fireEvent, screen } from '@testing-library/react';

import * as transactionStatus from '@transaction/configuration/statusConfig';
import { getTransactionStatus } from '@transaction/configuration/statusConfig';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import ChangeCommissionStatus from './ChangeCommissionStatus';
import statusMessages from './statusMessages';

jest.useRealTimers();
jest.mock('@walletconnect/sign-client', () => ({
  init: jest.fn().mockResolvedValue(Promise.resolve({ mock: true })),
}));
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));
jest.mock('@transaction/components/TxBroadcaster', () =>
  jest.fn(({ title, message, successButtonText, onSuccessClick, onRetry }) => (
    <div>
      <div data-testid="title">{title}</div>
      <div data-testid="message">{message}</div>
      <button data-testid="button" onClick={onRetry || onSuccessClick}>
        {onRetry ? 'Try again' : successButtonText}
      </button>
    </div>
  ))
);
jest.mock('src/utils/searchParams', () => ({
  removeSearchParamsFromUrl: jest.fn(),
}));
jest.spyOn(transactionStatus, 'getTransactionStatus');

describe('ChangeCommissionDialog', () => {
  const account = {
    summary: {
      isMultisignature: false,
    },
  };
  const signedTransaction = {
    module: 'pos',
    command: 'changeCommission',
    nonce: '11284145876061414261',
    fee: '27968742994614166',
    senderPublicKey: 'bfbef2a36e17ca75b66fd56adea8dd04ed234cd4188aca42fc8a7299d8eaadd8',
    params: {
      newCommission: 1000,
    },
    signatures: [
      '7d9b5e60e311dc96b141d5137bd1ceac887b3fe865c5ef2208eeb019035427341734bf9be5e6640a0b4e29451754d4a7375271ffafcc5eb3a40347ecb1b46803',
    ],
  };
  const transactions = {
    signedTransaction,
  };

  it('should get Transaction Status', () => {
    renderWithRouterAndQueryClient(ChangeCommissionStatus, { account, transactions });
    expect(getTransactionStatus).toHaveBeenCalledWith(account, transactions, expect.anything());
  });

  it('should get Transaction Status', () => {
    getTransactionStatus.mockReturnValue({
      code: txStatusTypes.broadcastSuccess,
    });
    const { title, message } = statusMessages((v) => v)[txStatusTypes.broadcastSuccess];
    renderWithRouterAndQueryClient(ChangeCommissionStatus, { account, transactions });
    expect(screen.getByTestId('title')).toHaveTextContent(title);
    expect(screen.getByTestId('message')).toHaveTextContent(message);
  });

  it('should show error message when broadcastError ', () => {
    const prevStep = jest.fn();
    getTransactionStatus.mockReturnValue({
      code: txStatusTypes.broadcastError,
    });
    const { title, message } = statusMessages((v) => v)[txStatusTypes.broadcastError];
    renderWithRouterAndQueryClient(ChangeCommissionStatus, { account, transactions, prevStep });
    expect(screen.getByTestId('title')).toHaveTextContent(title);
    expect(screen.getByTestId('message')).toHaveTextContent(message);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(prevStep).toHaveBeenCalledTimes(1);
  });
});
