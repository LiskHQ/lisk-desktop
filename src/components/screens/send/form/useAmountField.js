import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import numeral from 'numeral';

import { toRawLsk } from '../../../../utils/lsk';
import { validateAmountFormat } from '../../../../utils/validators';
import regex from '../../../../utils/regex';

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

const useAmountField = (initialValue, token) => {
  const { t, i18n } = useTranslation();

  const getAmountFeedbackAndError = (value, maxAmount = 0) => {
    let { message: feedback } = validateAmountFormat({
      value,
      token,
      funds: maxAmount,
      checklist: ['ZERO', 'MAX_ACCURACY', 'FORMAT', 'INSUFFICIENT_FUNDS'],
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
