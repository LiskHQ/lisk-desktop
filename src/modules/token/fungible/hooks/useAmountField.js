import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { regex } from 'src/const/regex';
import { validateAmount } from 'src/utils/validators';
import { convertToBaseDenom } from '../utils/helpers';

let loaderTimeout = null;

const baseState = {
  required: true,
  isLoading: false,
  error: false,
  feedback: '',
};

const getAmountFieldState = (initialValue, getAmountFeedbackAndError) =>
  initialValue
    ? {
        ...baseState,
        ...getAmountFeedbackAndError(initialValue),
        value: initialValue,
      }
    : {
        ...baseState,
        value: '',
      };

const useAmountField = (initialValue, balance = '0', token) => {
  const { t, i18n } = useTranslation();

  const getAmountFeedbackAndError = (value, maxAmount = balance) => {
    const checklist = ['FORMAT', 'MAX_ACCURACY', 'NEGATIVE_AMOUNT', 'INSUFFICIENT_FUNDS'];
    let { message: feedback } = validateAmount({
      amount: value,
      token,
      accountBalance: maxAmount,
      checklist: [...checklist],
    });

    if (!feedback && BigInt(maxAmount) < BigInt(convertToBaseDenom(value, token))) {
      feedback = t('Provided amount is higher than your current balance.');
    }
    return { error: !!feedback, feedback };
  };

  const [amountField, setAmountField] = useState(
    getAmountFieldState(initialValue, getAmountFeedbackAndError)
  );

  useEffect(() => {
    setAmountField(getAmountFieldState(initialValue, getAmountFeedbackAndError));
  }, [initialValue, token]);

  const onAmountInputChange = ({ value: amount }, maxAmount) => {
    const { leadingPoint, maxDecimals } = regex.amount[i18n.language];
    amount = leadingPoint.test(amount) ? `0${amount}` : amount;
    const isAmountValid = !maxDecimals(token).test(amount);

    if (isAmountValid) {
      clearTimeout(loaderTimeout);

      setAmountField({
        ...baseState,
        ...amountField,
        value: amount,
        isLoading: true,
      });
      loaderTimeout = setTimeout(() => {
        setAmountField({
          ...baseState,
          value: amount,
          ...getAmountFeedbackAndError(amount, maxAmount.value),
        });
      }, 300);
    } else {
      const { message: feedback } = validateAmount({
        token,
        amount,
        accountBalance: balance,
        checklist: ['MAX_ACCURACY'],
      });

      setAmountField({ ...amountField, isLoading: false, error: !!feedback, feedback });
    }
  };

  return [amountField, onAmountInputChange];
};

export default useAmountField;
