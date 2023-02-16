import { getNameFromAccount } from './getNameFromAccount';

const accAddress = 'lskdgtenb76rf93bzd56cqn6ova46wfvoesbk4hnd';
const accName = 'masoud123';
const settings = {
  hardwareAccounts: {
    20231: [
      {
        address: accAddress,
        name: accName,
      },
      {
        address: 'lsk5d58ubcybferq92wh3x82ca24bgef3tzqrdayu',
        name: 'masoud456',
      },
    ],
    21650: [],
  },
};

describe('getNameFromAccount', () => {
  it('returns account name if account is stored', () => {
    expect(getNameFromAccount(accAddress, settings, 20231)).toEqual(accName);
  });

  it('returns null if account array exists but account is not stored', () => {
    expect(getNameFromAccount(accAddress, settings, 21650)).toBeNull();
  });

  it('returns null if account is not stored', () => {
    expect(getNameFromAccount(accAddress, settings, 21636)).toBeNull();
  });
});
