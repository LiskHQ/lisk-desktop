import React from 'react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { screen } from '@testing-library/react';

import { getTransactionStatus } from '@transaction/configuration/statusConfig';
import * as transactionStatus from '@transaction/configuration/statusConfig';
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
  jest.fn(({ title, message }) => (
    <div>
      <div data-testid="title">{title}</div>
      <div data-testid="message">{message}</div>
    </div>
  ))
);
jest.spyOn(transactionStatus, 'getTransactionStatus');

describe('ChangeCommissionDialog', () => {
  const account = {
    summary: {
      isMultisignature: false,
    },
  };
  const transactions = {
    params: {
      newCommission: 1000,
    },
  };

  it('should get Transaction Status', () => {
    renderWithRouterAndQueryClient(ChangeCommissionStatus, { account, transactions });
    expect(getTransactionStatus).toHaveBeenCalledWith(
      account,
      transactions,
      account.summary.isMultisignature
    );
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
});
