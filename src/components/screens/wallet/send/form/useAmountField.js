import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import numeral from 'numeral';
import {
  formatAmountBasedOnLocale,
} from '../../../../../utils/formattedNumber';
import { validateAmountFormat } from '../../../../../utils/validators';
import regex from '../../../../../utils/regex';

const useAmountField = (initialValue, getMaxAmount) => {
  const { t, i18n } = useTranslation();
  const {
    settings: { token: { active: token } },
  } = useSelector(state => state);

  const getAmountFeedbackAndError = (value) => {
    let { message: feedback } = validateAmountFormat({ value, token });

    if (!feedback && parseFloat(getMaxAmount()) < numeral(value).value()) {
      feedback = t('Provided amount is higher than your current balance.');
    }
    return { error: !!feedback, feedback };
  };
  let loaderTimeout = null;

  const [amountField, setAmountField] = useState(initialValue
    ? {
      ...getAmountFeedbackAndError(initialValue),
      value: initialValue,
    }
    : {
      error: false,
      feedback: '',
      value: '',
    });

  const onAmountInputChange = ({ value }) => {
    const { leadingPoint } = regex.amount[i18n.language];
    value = leadingPoint.test(value) ? `0${value}` : value;
    clearTimeout(loaderTimeout);
    setAmountField({
      ...amountField,
      value,
      isLoading: true,
    });
    loaderTimeout = setTimeout(() => {
      setAmountField({
        value,
        ...getAmountFeedbackAndError(value),
        isLoading: false,
      });
    }, 300);
  };

  const setEntireBalance = () => {
    const value = formatAmountBasedOnLocale({
      value: getMaxAmount(),
      format: '0.[00000000]',
    });
    onAmountInputChange({ value });
  };

  return [amountField, onAmountInputChange, setEntireBalance];
};

export default useAmountField;
