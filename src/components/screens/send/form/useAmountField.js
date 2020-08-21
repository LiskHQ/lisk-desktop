import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import numeral from 'numeral';
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

const useAmountField = (initialValue) => {
  const { t, i18n } = useTranslation();
  const {
    settings: { token: { active: token } },
  } = useSelector(state => state);

  const getAmountFeedbackAndError = (value) => {
    let { message: feedback } = validateAmountFormat({ value, token });

    const maxAmount = 1000;
    if (!feedback && parseFloat(maxAmount) < numeral(value).value()) {
      feedback = t('Provided amount is higher than your current balance.');
    }
    return { error: !!feedback, feedback };
  };

  const [amountField, setAmountField] = useState(
    getAmountFieldState(initialValue, getAmountFeedbackAndError),
  );

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

  console.log('useAMountField', amountField);
  return [amountField, onAmountInputChange];
};

export default useAmountField;
