import { useSelector } from 'react-redux';
import { mockHWCurrentDevice } from '../__fixtures__';
import { getHWAccounts } from './getHWAccounts';
import { getNameFromAccount } from './getNameFromAccount';

jest.useRealTimers();

jest.mock('@liskhq/lisk-client', () => ({
  ...jest.requireActual('@liskhq/lisk-client'),
  cryptography: {
    ...jest.requireActual('@liskhq/lisk-client').cryptography,
    address: {
      getLisk32AddressFromPublicKey: jest.fn(() => 'lskdgtenb76rf93bzd56cqn6ova46wfvoesbk4hnd'),
    },
  },
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('src/modules/account/utils/getTokenBalances');

describe.skip('getHWAccounts', () => {
  it('returns a list of accounts where all accounts are initialized', async () => {
    const mockAppState = {
      settings: {
        hardwareAccounts: {
          [mockHWCurrentDevice.model]: [
            {
              address: 'lskdgtenb76rf93bzd56cqn6ova46wfvoesbk4hnd',
              name: 'masoud123',
            },
            {
              address: 'lsk5d58ubcybferq92wh3x82ca24bgef3tzqrdayu',
              name: 'masoud456',
            },
          ],
        },
      },
    };
    useSelector.mockImplementation((callback) => callback(mockAppState));

    expect(
      await getHWAccounts({
        getName: (address, device) => getNameFromAccount(address, mockAppState.settings, device),
        device: mockHWCurrentDevice,
      })
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metadata: expect.objectContaining({
            name: 'masoud123',
            accountIndex: 0,
            address: 'lskdgtenb76rf93bzd56cqn6ova46wfvoesbk4hnd',
            pubkey: 'a07e06d3d21bfcbd6e6cb158a0adc18b6ccc92db66dc8a323c7462af9c539fab',
          }),
        }),
        expect.objectContaining({
          metadata: expect.objectContaining({
            name: 'New account',
            accountIndex: 1,
            address: 'lskdgtenb76rf93bzd56cqn6ova46wfvoesbk4hnd',
            pubkey: '49dc55a205bf1fecbee41bde6e354eaa85fdc3c2809e85f5720a83986fad4b0a',
          }),
        }),
      ])
    );
  });
});
