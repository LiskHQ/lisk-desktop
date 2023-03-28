import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import numeral from 'numeral';

import { regex } from 'src/const/regex';
import { MIN_ACCOUNT_BALANCE } from '@transaction/configuration/transactions';
import { validateAmountFormat } from 'src/utils/validators';
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

const useAmountField = (initialValue, balance, token) => {
  const { t, i18n } = useTranslation();

  const getAmountFeedbackAndError = (value, maxAmount = balance) => {
    const checklist = [
      'NEGATIVE_AMOUNT',
      'MAX_ACCURACY',
      'INSUFFICIENT_FUNDS',
      'MIN_BALANCE',
      'FORMAT',
    ];
    let { message: feedback } = validateAmountFormat({
      value,
      token,
      funds: Number(maxAmount) + Number(MIN_ACCOUNT_BALANCE),
      checklist: [...checklist, 'MIN_BALANCE'],
    });

    if (
      !feedback &&
      BigInt(maxAmount) < BigInt(convertToBaseDenom(numeral(value).value(), token))
    ) {
      feedback = t('Provided amount is higher than your current balance.');
    }
    return { error: !!feedback, feedback };
  };

  const [amountField, setAmountField] = useState(
    getAmountFieldState(initialValue, getAmountFeedbackAndError)
  );

  useEffect(() => {
    setAmountField(getAmountFieldState(initialValue, getAmountFeedbackAndError));
  }, [initialValue]);

  const onAmountInputChange = ({ value: amount }, maxAmount) => {
    const { leadingPoint, maxDecimals } = regex.amount[i18n.language];
    amount = leadingPoint.test(amount) ? `0${amount}` : amount;
    const isAmountValid = !maxDecimals(token).test(amount);

    if (!isAmountValid) {
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
      const { message: feedback } = validateAmountFormat({
        token,
        value: amount,
        funds: Number(balance) + Number(MIN_ACCOUNT_BALANCE),
        checklist: ['MAX_ACCURACY'],
      });

      setAmountField({ ...amountField, isLoading: false, error: !!feedback, feedback });
    }
  };

  return [amountField, onAmountInputChange];
};

export default useAmountField;
