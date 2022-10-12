import { getTransactionBaseFees, getTransactionFee } from '@transaction/api';
import { mockTokensBalance, mockTokensSupported } from '@token/fungible/__fixtures__/mockTokens';
import { mountWithRouterAndQueryClient } from 'src/utils/testHelpers';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import mockSavedAccounts from '@tests/fixtures/accounts';
import {
  useCurrentApplication,
  useApplicationManagement,
} from '@blockchainApplication/manage/hooks';
import { useCurrentAccount } from '@account/hooks';
import wallets from '@tests/constants/wallets';
import Send from './index';
import { useTokensBalance, useTokensSupported } from '../../hooks/queries';

const mockSetCurrentApplication = jest.fn();
const mockSetApplication = jest.fn();
const mockSetAccount = jest.fn();
const mockCurrentApplication = mockManagedApplications[0];

jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('@account/hooks/useCurrentAccount');
jest.mock('@transaction/api');
jest.mock('@token/fungible/hooks/queries');

useApplicationManagement.mockReturnValue({
  setApplication: mockSetApplication,
  applications: mockManagedApplications,
});

useCurrentAccount.mockReturnValue([mockSavedAccounts[0], mockSetAccount]);
useCurrentApplication.mockReturnValue([mockCurrentApplication, mockSetCurrentApplication]);
useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: false,  isSuccess: true });
useTokensSupported.mockReturnValue({ data: mockTokensSupported, isLoading: false, isSuccess: true });

getTransactionBaseFees.mockResolvedValue({
  Low: 0,
  Medium: 1000,
  High: 2000,
});

getTransactionFee.mockResolvedValue({
  value: 0.1,
  error: false,
  feedback: '',
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
