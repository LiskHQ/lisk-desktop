import { INSUFFICENT_TOKEN_BALANCE_MESSAGE } from '../constants';
import { getTokenBalanceErrorMessage } from './getTokenBalanceErrorMessage';

function interpolateFn(templateString, data) {
  let result = templateString;
  const keys = templateString.match(/{{[A-Za-z0-9_]+}}/g);
  keys.forEach((key) => {
    const normalizedKey = key.match(/(?<={{)[A-Za-z0-9_]+(?=}})/)?.[0];

    if (normalizedKey && data[normalizedKey]) result = result.replace(key, data[normalizedKey]);
  });

  return result;
}

describe('getTokenBalanceErrorMessage', () => {
  const mockTranslationFn = jest.fn((text, data) => interpolateFn(text, data));

  it('Should not return an error message', () => {
    const result = getTokenBalanceErrorMessage({
      t: mockTranslationFn,
      hasAvailableTokenBalance: true,
      hasSufficientBalanceForFee: true,
      feeTokenSymbol: 'LSK',
    });

    expect(result).toEqual({});
  });
  it('Should return an insufficient fee error message', () => {
    const result = getTokenBalanceErrorMessage({
      t: mockTranslationFn,
      hasAvailableTokenBalance: true,
      hasSufficientBalanceForFee: false,
      feeTokenSymbol: 'LSK',
    });

    expect(result).toEqual({
      message: 'There are no LSK tokens to pay for fees.',
    });
  });
  it('Should return an insufficent token balance error message if error type is provided', () => {
    const result = getTokenBalanceErrorMessage({
      t: mockTranslationFn,
      hasAvailableTokenBalance: false,
      hasSufficientBalanceForFee: false,
      feeTokenSymbol: 'LSK',
      errorType: 'registerValidator',
    });

    expect(result).toEqual({
      message: INSUFFICENT_TOKEN_BALANCE_MESSAGE.registerValidator,
    });
  });

  it('Should return an insufficent token balance error message if error type is not provided', () => {
    const result = getTokenBalanceErrorMessage({
      t: mockTranslationFn,
      hasAvailableTokenBalance: false,
      hasSufficientBalanceForFee: false,
      feeTokenSymbol: 'LSK',
    });

    expect(result).toEqual({
      message: INSUFFICENT_TOKEN_BALANCE_MESSAGE.sendToken,
    });
  });
});
