import mockSavedAccounts from '@tests/fixtures/accounts';
import { OutlineButton } from 'src/theme/buttons';
import { mountWithRouter } from 'src/utils/testHelpers';
import { mockHWAccounts } from '@hardwareWallet/__fixtures__';
import AccountRow from '../AccountRow';
import SwitchAccount from './SwitchAccount';

jest.mock('@account/hooks/useAccounts', () => ({
  useAccounts: jest.fn().mockReturnValue([mockSavedAccounts]),
}));
jest.mock('src/modules/hardwareWallet/hooks/useHWAccounts', () =>
  jest.fn().mockReturnValue({ accounts: mockHWAccounts })
);

jest.mock('react-i18next');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn(() => ({
    accounts: mockSavedAccounts,
  })),
  useCurrentAccount: jest.fn(() => (
    [mockSavedAccounts[0], jest.fn()]
  )),
}));

describe('Switch account', () => {
  it('Should render properly', () => {
    const wrapper = mountWithRouter(SwitchAccount);

    expect(wrapper.find(AccountRow)).toHaveLength(mockSavedAccounts.length + mockHWAccounts.length);
    expect(wrapper.find(AccountRow).first()).toHaveText(`${mockSavedAccounts[0].metadata.name} ${mockSavedAccounts[0].metadata.address}`);
    expect(wrapper.find(OutlineButton).first()).toHaveText('Add another account');
  });
});
