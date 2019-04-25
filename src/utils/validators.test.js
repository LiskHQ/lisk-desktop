import { validateAddress } from './validators';
import networks from '../constants/networks';
import accounts from '../../test/constants/accounts';

describe('Validate Address', () => {
  it('Should return -1 if empty adress', () => {
    expect(validateAddress('LSK', '', networks.testnet.code)).toBe(-1);
    expect(validateAddress('BTC', '')).toBe(-1);
  });

  it('Should validate LSK address', () => {
    expect(validateAddress('LSK', accounts.genesis.address)).toBe(0);
    expect(validateAddress('LSK', '12345')).toBe(1);
  });

  it('Should validate BTC address', () => {
    expect(validateAddress('BTC', accounts.genesis.address)).toBe(1);
  });
});
