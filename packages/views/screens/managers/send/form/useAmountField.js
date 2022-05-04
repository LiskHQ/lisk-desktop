import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import numeral from 'numeral';

import { regex } from 'src/const/regex';
import { tokenMap } from '@token/fungible/consts/tokens';
import { MIN_ACCOUNT_BALANCE } from '@transaction/configuration/transactions';
import { toRawLsk } from '@token/fungible/utils/lsk';
import { validateAmountFormat } from 'src/utils/validators';

let loaderTimeout = null;

const baseState = {
  required: true,
  isLoading: false,
  error: false,
  feedback: '',
};

const getAmountFieldState = (initialValue, getAmountFeedbackAndError) => (initialValue
  ? {
    ...baseState,
    ...getAmountFeedbackAndError(initialValue),
    value: initialValue,
  }
  : {
    ...baseState,
    value: '',
  });

const useAmountField = (initialValue, balance, token) => {
  const { t, i18n } = useTranslation();

  const getAmountFeedbackAndError = (value, maxAmount = balance) => {
    const checklist = ['NEGATIVE_AMOUNT', 'MAX_ACCURACY', 'INSUFFICIENT_FUNDS', 'MIN_BALANCE', 'FORMAT'];
    let { message: feedback } = validateAmountFormat({
      value,
      token,
      funds: token !== tokenMap.LSK.key
        ? maxAmount : Number(maxAmount) + Number(MIN_ACCOUNT_BALANCE),
      checklist: token !== tokenMap.LSK.key ? checklist : [...checklist, 'MIN_BALANCE'],
    });

    if (!feedback && maxAmount < toRawLsk(numeral(value).value())) {
      feedback = t('Provided amount is higher than your current balance.');
    }
    return { error: !!feedback, feedback };
  };

  const [amountField, setAmountField] = useState(
    getAmountFieldState(initialValue, getAmountFeedbackAndError),
  );

  const onAmountInputChange = ({ value }, maxAmount) => {
    const { leadingPoint } = regex.amount[i18n.language];
    value = leadingPoint.test(value) ? `0${value}` : value;
    clearTimeout(loaderTimeout);

    setAmountField({
      ...baseState,
      ...amountField,
      value,
      isLoading: true,
    });
    loaderTimeout = setTimeout(() => {
      setAmountField({
        ...baseState,
        value,
        ...getAmountFeedbackAndError(value, maxAmount.value),
      });
    }, 300);
  };

  return [amountField, onAmountInputChange];
};

export default useAmountField;
