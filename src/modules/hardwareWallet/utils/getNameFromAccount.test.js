import { mockHWCurrentDevice } from '@hardwareWallet/__fixtures__';
import { getNameFromAccount } from './getNameFromAccount';

const accAddress = 'lskdgtenb76rf93bzd56cqn6ova46wfvoesbk4hnd';
const accName = 'masoud123';
const settings = {
  hardwareAccounts: {
    [mockHWCurrentDevice.model]: [
      {
        address: accAddress,
        name: accName,
      },
      {
        address: 'lsk5d58ubcybferq92wh3x82ca24bgef3tzqrdayu',
        name: 'masoud456',
      },
    ],
    nano: [],
  },
};

describe('getNameFromAccount', () => {
  it('returns account name if account is stored', () => {
    expect(getNameFromAccount(accAddress, settings, mockHWCurrentDevice.model)).toEqual(accName);
  });

  it('returns null if account array exists but account is not stored', () => {
    expect(getNameFromAccount('randomAddress', settings, mockHWCurrentDevice.model)).toBeNull();
  });
});
