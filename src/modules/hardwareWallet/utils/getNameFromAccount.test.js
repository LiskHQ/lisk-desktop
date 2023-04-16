import { mockHWAccounts } from '@hardwareWallet/__fixtures__';
import { getNameFromAccount } from './getNameFromAccount';

describe('getNameFromAccount', () => {
  it('returns account name if account is stored', () => {
    const accAddress = mockHWAccounts[0].metadata.address;
    const accName = mockHWAccounts[0].metadata.name;
    expect(getNameFromAccount(accAddress, mockHWAccounts)).toEqual(accName);
  });

  it('returns null if account array exists but account is not stored', () => {
    expect(getNameFromAccount('randomAddress', mockHWAccounts)).toBeUndefined();
  });
});
