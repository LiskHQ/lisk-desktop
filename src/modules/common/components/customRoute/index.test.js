import React from 'react';
import { useSelector } from 'react-redux';
import { MemoryRouter, Route } from 'react-router';
import { render, screen } from '@testing-library/react';
import useSettings from '@settings/hooks/useSettings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import mockSavedAccounts from '@tests/fixtures/accounts';
import routes from 'src/routes/routes';
import ReclaimBalance from '@legacy/manager/reclaimBalance';
import { useCheckLegacyAccount } from '@legacy/hooks/queries';
import wallets from '@tests/constants/wallets';
import blockchainApplicationsManage from '@tests/fixtures/blockchainApplicationsManage';
import CustomRoute from './index';

const Public = () => <h1>Public</h1>;
const Private = () => <h1>Private</h1>;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const mockSetAccount = jest.fn();
const mockToggleSetting = jest.fn();
jest.mock('react-i18next');
jest.mock('@settings/hooks/useSettings');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn(() => ({
    accounts: mockSavedAccounts,
  })),
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0], mockSetAccount]),
}));
jest.mock('@legacy/hooks/queries');

describe('CustomRoute', () => {
  const mockAppState = {
    token: {
      active: 'LSK',
    },
    blockChainApplications: {
      current: blockchainApplicationsManage[2],
    },
    wallet: {
      info: {
        LSK: wallets.genesis,
      },
    },
    network: {
      name: 'testnet',
      networks: {
        LSK: {
          serviceUrl: 'someUrl',
        },
      },
    },
    transactions: { pending: [] },
  };

  beforeEach(() => {
    useSelector.mockImplementation((callback) => callback(mockAppState));
    useSettings.mockReturnValue({ mainChainNetwork: 'devnet', toggleSetting: mockToggleSetting });
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  const props = {
    t: (key) => key,
    history: { location: { pathname: '' } },
    path: '/private',
    component: Private,
    forbiddenTokens: [],
  };

  const queryClient = new QueryClient();
  const isAuth = ({ isPrivate }) =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/private/test']}>
          <div>
            <Route path={routes.manageAccounts.path} component={Public} />
            <Route path={routes.reclaim.path} component={ReclaimBalance} />
            <CustomRoute {...props} isPrivate={isPrivate} />
          </div>
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('should render Component if user is authenticated', () => {
    useCheckLegacyAccount.mockImplementation(() => ({ isMigrated: true }));
    isAuth({ isPrivate: true });
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('should redirect to reclaim path if user is not migrated', () => {
    useCheckLegacyAccount.mockImplementation(() => ({ isMigrated: false }));
    isAuth({ isPrivate: true });
    expect(screen.getByText('Reclaim LSK tokens')).toBeInTheDocument();
  });
});
