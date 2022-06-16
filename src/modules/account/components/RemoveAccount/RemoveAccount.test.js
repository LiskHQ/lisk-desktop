import {
  screen,
} from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import RemoveAccount from './RemoveAccount';

const mockSetAccount = jest.fn();
jest.mock('react-i18next');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn(() => ({
    accounts: mockSavedAccounts,
    getAccountByAddress: jest.fn(),
    deleteAccountByAddress: jest.fn(),
  })),
  useCurrentAccount: jest.fn(() => (
    [mockSavedAccounts[0], mockSetAccount]
  )),
}));

describe('Remove account', () => {
  let props;

  beforeEach(() => {
    props = {
      address: 'lskwhocotuu6bwnhwgjt859ugp467f8kuhdo5xfd6',
      history: {
        push: jest.fn(),
      },
    };
  });

  it('should render properly', async () => {
    renderWithRouter(RemoveAccount, props);
    expect(screen.getByText('Remove Account?')).toBeTruthy();
    expect(screen.getByTestId('accountRemovedIcon')).toBeTruthy();
    expect(screen.getByText('Remove now')).toBeTruthy();
  });
});
