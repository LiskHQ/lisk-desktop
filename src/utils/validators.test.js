import i18n from 'src/utils/i18n/i18n';
import accounts from '@tests/constants/wallets';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import { getTokenDecimals } from '@token/fungible/utils/helpers';
import { validateAddress, validateLSKPublicKey, validateAmount, isNumeric } from './validators';

const mockToken = mockAppsTokens.data[0];

describe('Validate Address', () => {
  it('Should return -1 if empty address', () => {
    expect(validateAddress('')).toBe(-1);
  });

  it('Should validate LSK address', () => {
    expect(validateAddress(accounts.genesis.summary.address)).toBe(0);
    expect(validateAddress('12345')).toBe(1);
  });
});

describe('Validate Public Key', () => {
  const invalidPublicKey = 'invalid_public_key';

  it('Should return 0 if public key is valid', () => {
    expect(validateLSKPublicKey(accounts.genesis.summary.publicKey)).toBe(0);
  });

  it('Should return 1 if public key is invalid', () => {
    expect(validateLSKPublicKey(invalidPublicKey)).toBe(1);
  });
});

describe('Validate Amount Format', () => {
  const errors = {
    ZERO: i18n.t("Amount can't be zero."),
    INVALID: i18n.t('Provide a correct amount of {{token}}', { token: 'LSK' }),
    FLOATING_POINT: i18n.t('Maximum allowed decimal point is {{decimal}}.', {
      decimal: getTokenDecimals(mockToken),
    }),
  };

  it('Should return errors.ZERO if amount is zero', () => {
    expect(validateAmount({ amount: 0.0, token: mockToken })).toEqual({
      error: true,
      message: errors.ZERO,
    });
  });

  it('Should return errors.INVALID if format is invalid', () => {
    ['0,', '0,0', '0.1.2', '1..', '1a,1', '2.d2'].forEach((amount) => {
      expect(validateAmount({ amount, token: mockToken })).toEqual({
        error: true,
        message: errors.INVALID,
      });
    });
  });

  it('Should return errors.FLOATING_POINT if has more than 8 digits after floating point', () => {
    expect(validateAmount({ amount: '0.123456789', token: mockToken })).toEqual({
      error: true,
      message: errors.FLOATING_POINT,
    });
  });

  it('Should return { error: false, message: "" } if valid amount is entered', () => {
    ['123.43213', '0.00000001'].forEach((amount) => {
      expect(validateAmount({ amount, token: mockToken })).toEqual({
        error: false,
        message: '',
      });
    });
  });
});

describe('isNumeric', () => {
  it('should return false for invalid decimal numbers', () => {
    expect(isNumeric('12..4')).toBe(false);
  });

  it('should return true for valid decimal numbers', () => {
    expect(isNumeric('12.4')).toBe(true);
  });

  it('should return true for integers', () => {
    expect(isNumeric('123456789')).toBe(true);
  });
});

describe('Insufficient funds', () => {
  it('should return true for amounts greater than balance', () => {
    ['1.1', '3', '1000', '111111.11111111'].forEach((amount) => {
      expect(validateAmount({ amount, accountBalance: '100000000', token: mockToken, checklist: ['INSUFFICIENT_FUNDS'] })).toEqual({
        error: true,
        message: 'Provided amount is higher than your current balance.',
      });
    });
  });
  it('should return false for (amount + fee) >= balance', () => {
    ['0.9', '0.99', '0.00001'].forEach((amount) => {
      expect(validateAmount({ amount, accountBalance: '100000000', token: mockToken, checklist: ['INSUFFICIENT_FUNDS'] })).toEqual({
        error: false,
        message: '',
      });
    });
  });
});

describe('minimum balance', () => {
  it('should return true for amounts whose value after (fee + transaction) amount is < minimum amount', () => {
    ['0.9999', '1'].forEach((amount) => {
      expect(validateAmount({ amount, accountBalance: '100000000', token: mockToken, checklist: ['MIN_BALANCE'] })).toEqual({
        error: true,
        message: 'Provided amount will result in a wallet with less than the minimum balance.',
      });
    });
  });

  it('should return false for amounts whose value after (fee + transaction) amount is >= minimum amount', () => {
    ['0.9', '0'].forEach((amount) => {
      expect(validateAmount({ amount, accountBalance: '100000000', token: mockToken, checklist: ['MIN_BALANCE'] })).toEqual({
        error: false,
        message: '',
      });
    });
  });
});
