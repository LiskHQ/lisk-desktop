import { INSUFFICENT_TOKEN_BALANCE_MESSAGE } from '../constants';

export function getTokenBalanceErrorMessage({
  hasAvailableTokenBalance = true,
  hasSufficientBalanceForFee = true,
  feeTokenSymbol,
  errorType,
  t,
}) {
  if (!hasAvailableTokenBalance) {
    return {
      message: INSUFFICENT_TOKEN_BALANCE_MESSAGE[errorType || 'registerMultiSignature'],
    };
  }

  if (!hasSufficientBalanceForFee) {
    return {
      message: t('There are no {{feeTokenSymbol}} tokens to pay for fees.', {
        feeTokenSymbol,
      }),
    };
  }

  return {};
}
