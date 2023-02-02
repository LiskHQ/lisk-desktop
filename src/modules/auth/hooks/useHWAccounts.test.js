import { getAccountsList } from 'src/modules/wallet/utils/hwManager';
import useHWAccounts from './useHWAccounts';

jest.mock('src/modules/wallet/utils/hwManager', () => ({
  getAccountsList: jest.fn(),
}));

describe('useHWAccounts', () => {
  it('returns a list of HW Accounts', () => {
    useHWAccounts();
    expect(getAccountsList).toHaveBeenCalledTimes(1);
  });
});
