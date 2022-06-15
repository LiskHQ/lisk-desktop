import mockSavedAccounts from '@tests/fixtures/accounts';
import routes from '@screens/router/routes';
import { mountWithProps } from 'src/utils/testHelpers';
import history from 'src/utils/history';
import RemoveCurrentAccountFlow from '.';

jest.mock('@account/hooks/useAccounts', () => ({
  useAccounts: jest.fn().mockReturnValue([mockSavedAccounts]),
}));
