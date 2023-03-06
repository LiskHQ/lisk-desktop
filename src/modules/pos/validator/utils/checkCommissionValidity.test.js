import { checkCommissionValidity } from './checkCommissionValidity';

describe('checkCommissionValidity', () => {
  it('returns true if new commission is less than old commission and difference is less than 5%', () => {
    expect(checkCommissionValidity('96.50', '100.00')).toBe(true);
  });

  it('returns true if new commission is greater than old commission and difference is less than 5%', () => {
    expect(checkCommissionValidity('63.30', '60.00')).toBe(true);
  });

  it('returns false if difference is more than 5%', () => {
    expect(checkCommissionValidity('40.00', '50.00')).toBe(false);
  });
});
