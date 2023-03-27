import { screen } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import RemoveSelectedAccountFlow from './RemoveSelectedAccountFlow';

const mockSetAccount = jest.fn();
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn(() => ({
    accounts: mockSavedAccounts,
    getAccountByAddress: jest.fn().mockReturnValue(mockSavedAccounts[0]),
    deleteAccountByAddress: jest.fn(),
  })),
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0], mockSetAccount]),
}));

describe('Remove current account flow', () => {
  let props;

  beforeEach(() => {
    props = {
      history: {
        location: {
          path: '/remove-account',
          search: `?address=${mockSavedAccounts[0].metadata.address}`,
        },
        push: jest.fn(),
      },
    };
    renderWithRouter(RemoveSelectedAccountFlow, props);
  });

  it('should render properly', async () => {
    expect(screen.getByText(mockSavedAccounts[0].metadata.address)).toBeTruthy();
  });
});
