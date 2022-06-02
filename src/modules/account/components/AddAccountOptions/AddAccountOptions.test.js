import { screen } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { renderWithRouter } from 'src/utils/testHelpers';
import AddAccountOptions from './AddAccountOptions';

jest.mock('react-i18next');
jest.mock('../../hooks/useAccounts', () => ({
  useAccounts: jest.fn().mockReturnValue([mockSavedAccounts]),
}));

const props = {
  history: { push: jest.fn() },
};

beforeEach(() => {
  renderWithRouter(AddAccountOptions, props);
});

describe('Add Account Choice', () => {
  it('Should render the add account choice page', async () => {
    expect(screen.getByText('Add account')).toBeTruthy();
    expect(screen.getByText('Select the applicable mode.')).toBeTruthy();
    expect(screen.getByText('Don’t have a Lisk account yet?')).toBeTruthy();
    expect(screen.getByText('Restore from file')).toBeTruthy();
    expect(screen.getByText('Secret recovery phrase')).toBeTruthy();
  });
});
