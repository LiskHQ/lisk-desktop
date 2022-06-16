import mockSavedAccounts from '@tests/fixtures/accounts';

jest.mock('@account/hooks/useAccounts', () => ({
  useAccounts: jest.fn().mockReturnValue([mockSavedAccounts]),
}));
