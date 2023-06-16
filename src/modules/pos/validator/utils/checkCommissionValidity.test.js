import { checkCommissionValidity, isCommissionIncrease } from './checkCommissionValidity';

describe('checkCommissionValidity', () => {
  it('returns true if new commission is less than old commission', () => {
    expect(checkCommissionValidity('57.80', '60.00')).toBe(true);
  });

  it('returns true if new commission is greater than old commission and difference is less than 5%', () => {
    expect(checkCommissionValidity('54.50', '50.00')).toBe(true);
  });

  it('returns false if new commission is greater than old commission and difference is more than 5%', () => {
    expect(checkCommissionValidity('70.00', '50.00')).toBe(false);
  });

  it('should correctly calculate if new commission is greater than old commission', () => {
    expect(isCommissionIncrease('70.00', '50.00')).toBe(true);
  });

  it('should correctly calculate if new commission is greater than old commission', () => {
    expect(isCommissionIncrease('40.00', '50.00')).toBe(false);
  });
});
