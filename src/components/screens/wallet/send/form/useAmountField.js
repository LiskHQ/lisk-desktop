import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import numeral from 'numeral';
import { validateAmountFormat } from '../../../../../utils/validators';
import regex from '../../../../../utils/regex';

let loaderTimeout = null;

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
  const baseState = {
    required: true,
    isLoading: false,
    error: false,
    feedback: '',
  };

  const [amountField, setAmountField] = useState(initialValue
    ? {
      ...baseState,
      ...getAmountFeedbackAndError(initialValue),
      value: initialValue,
    }
    : {
      ...baseState,
      value: '',
    });

  const onAmountInputChange = ({ value }) => {
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
        ...getAmountFeedbackAndError(value),
      });
    }, 300);
  };

  return [amountField, onAmountInputChange];
};

export default useAmountField;
