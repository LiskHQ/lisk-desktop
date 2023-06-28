import { convertCommissionToPercentage, convertCommissionToNumber } from './getValidatorCommission';

describe('convertCommissionToPercentage', () => {
  it('Should convert empty arguments it to percentage', () => {
    expect(convertCommissionToPercentage()).toEqual('0.00');
    expect(convertCommissionToPercentage()).not.toEqual('0');
  });

  it('Should convert any number to percentage', () => {
    expect(convertCommissionToPercentage(10000)).toEqual('100.00');
    expect(convertCommissionToPercentage(10000)).not.toEqual('100');
  });
});

describe('convertCommissionToPercentage', () => {
  it('Should convert empty arguments it to percentage', () => {
    expect(convertCommissionToNumber()).toEqual(0);
    expect(convertCommissionToNumber()).not.toEqual('0');
  });

  it('Should convert 16.40 to 1640', () => {
    expect(convertCommissionToNumber('16.40')).toEqual(1640);
  });

  it('Should convert 12 to 1200', () => {
    expect(convertCommissionToNumber('12')).toEqual(1200);
  });

  it('Should convert 12.1 to 1210', () => {
    expect(convertCommissionToNumber('12.1')).toEqual(1210);
  });

  it('Should convert any number to percentage', () => {
    expect(convertCommissionToNumber('100.00')).toEqual(10000);
    expect(convertCommissionToNumber('100.00')).not.toEqual('10000');
  });
});
