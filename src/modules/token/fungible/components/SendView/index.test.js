import { getTransactionBaseFees } from '@transaction/api';
import { mockTokensBalance, mockTokenSummary } from '@token/fungible/__fixtures__/mockTokens';
import { mountWithRouterAndQueryClient } from 'src/utils/testHelpers';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import mockSavedAccounts from '@tests/fixtures/accounts';
import {
  useCurrentApplication,
  useApplicationManagement,
} from '@blockchainApplication/manage/hooks';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__';
import { useCurrentAccount } from '@account/hooks';
import wallets from '@tests/constants/wallets';
import Send from './index';
import {
  useGetInitializationFees,
  useGetMinimumMessageFee,
  useTokenBalances,
  useTokenSummary,
} from '../../hooks/queries';
import { useTransferableTokens } from '../../hooks';

const mockSetCurrentApplication = jest.fn();
const mockSetApplication = jest.fn();
const mockSetAccount = jest.fn();
const mockCurrentApplication = mockManagedApplications[0];

jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('@account/hooks/useCurrentAccount');
jest.mock('@transaction/api');
jest.mock('../../hooks');
jest.mock('@token/fungible/hooks/queries');
jest.mock('@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta');
jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));

useApplicationManagement.mockReturnValue({
  setApplication: mockSetApplication,
  applications: mockManagedApplications.map((app, index) =>
    index === 0 ? { ...app, chainID: '00010000' } : app
  ),
});

useCurrentAccount.mockReturnValue([mockSavedAccounts[0], mockSetAccount]);
useCurrentApplication.mockReturnValue([mockCurrentApplication, mockSetCurrentApplication]);
useTokenBalances.mockReturnValue({ data: mockTokensBalance, isLoading: false, isSuccess: true });
useTokenSummary.mockReturnValue({
  data: mockTokenSummary,
  isLoading: false,
  isSuccess: true,
});
useBlockchainApplicationMeta.mockReturnValue({ data: mockBlockchainAppMeta, isSuccess: true });
useTransferableTokens.mockReturnValue({
  data: mockTokensBalance.data.map((token) => ({ ...token, logo: { svg: '', png: '' } })),
  isSuccess: true,
  isLoading: false,
});

useGetInitializationFees.mockReturnValue({
  data: { data: { escrowAccount: 165000, userAccount: 165000 } },
});
useGetMinimumMessageFee.mockReturnValue({ data: { data: { fee: 5000000 } } });

getTransactionBaseFees.mockResolvedValue({
  Low: 0,
  Medium: 1000,
  High: 2000,
});

const props = {
  settings: { currency: 'USD' },
  settingsUpdated: () => {},
  wallet: {
    token: { balance: wallets.genesis.balance },
  },
  t: (v) => v,
  prevState: {
    fields: {},
  },
  bookmarks: {
    LSK: [
      {
        title: 'ABC',
        address: 'lskhbxua8tpdckcewntcttfqfo4rbatampo2dgrno',
        balance: 10,
      },
      {
        title: 'FRG',
        address: 'lskhbxua8tpdckcewntcttfqfo4rbatampo2dgrno',
        balance: 15,
      },
      {
        title: 'KTG',
        address: 'lskhbxua8tpdckcewntcttfqfo4rbatampo2dgrno',
        balance: 7,
      },
    ],
  },
  history: {
    location: {
      path: '/wallet/send/send',
      search: '?recipient=16313739661670634666L&amount=10&reference=test',
    },
    push: jest.fn(),
  },
  initialValue: {},
};

describe('Send', () => {
  it('should render properly getting data from URL', () => {
    const wrapper = mountWithRouterAndQueryClient(Send, props);
    expect(wrapper).toContainMatchingElement('Dialog');
    expect(wrapper).toContainMatchingElement('MultiStep');
    expect(wrapper).toContainMatchingElement('SendForm');
    expect(wrapper).not.toContainMatchingElement('SendSummary');
    expect(wrapper).not.toContainMatchingElement('SendStatus');
  });

  it('should render properly without getting data from URL', () => {
    const newProps = { ...props };
    newProps.history.location.path = '';
    newProps.history.location.search = '';
    const wrapper = mountWithRouterAndQueryClient(Send, newProps);
    wrapper.update();
    expect(wrapper).toContainMatchingElement('Dialog');
    expect(wrapper).toContainMatchingElement('MultiStep');
    expect(wrapper).toContainMatchingElement('SendForm');
  });
});
