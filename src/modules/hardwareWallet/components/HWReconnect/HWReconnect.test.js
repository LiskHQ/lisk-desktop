import { screen } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import HWReconnect from './HWReconnect';

jest.mock('@account/hooks/useCurrentAccount', () => ({
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0]]),
}));

describe('HWReconnect', () => {
  it('displays properly', () => {
    renderWithRouter(HWReconnect);

    expect(screen.getByText('Reconnect to hardware wallet')).toBeInTheDocument();
    expect(screen.getByText('Your hardware wallet is disconnected.')).toBeInTheDocument();
    expect(
      screen.getByText('Please reconnect your hardware wallet to sign this transaction')
    ).toBeInTheDocument();
    expect(screen.getByText(mockSavedAccounts[0].metadata.name)).toBeInTheDocument();
    expect(screen.getByText('lsk3ay4z7wqjczbo5ogcqxgxx23xyacxmycwxfh4d')).toBeInTheDocument();
  });
});
