import {
  screen,
} from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import RemoveCurrentAccountFlow from './RemoveCurrentAccountFlow';

const mockSetAccount = jest.fn();
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn(() => ({
    accounts: mockSavedAccounts,
    getAccountByAddress: jest.fn().mockReturnValue(mockSavedAccounts[0]),
    deleteAccountByAddress: jest.fn(),
  })),
  useCurrentAccount: jest.fn(() => (
    [mockSavedAccounts[0], mockSetAccount]
  )),
}));

beforeEach(() => {
  renderWithRouter(RemoveCurrentAccountFlow);
});

describe('Remove current account flow', () => {
  it('should render properly', async () => {
    expect(screen.getByText(mockSavedAccounts[0].metadata.address)).toBeTruthy();
  });
});
