import { screen } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { TransactionConfirmFooter } from './TransactionConfirmFooter';

jest.mock('@account/hooks/useCurrentAccount', () => ({
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0]]),
}));

describe('HWReconnect', () => {
  it('displays properly', () => {
    renderWithRouter(TransactionConfirmFooter);
    expect(screen.getByText(mockSavedAccounts[0].metadata.name)).toBeInTheDocument();
    expect(screen.getByText('lsk3ay4z7wqjczbo5ogcqxgxx23xyacxmycwxfh4d')).toBeInTheDocument();
  });
});
