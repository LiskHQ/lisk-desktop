import { useSelector } from 'react-redux';
import { useState } from 'react';
import numeral from 'numeral';
import {
  formatAmountBasedOnLocale,
} from '../../../../../utils/formattedNumber';
import { fromRawLsk } from '../../../../../utils/lsk';
import { validateAmountFormat } from '../../../../../utils/validators';
import i18n from '../../../../../i18n';
import regex from '../../../../../utils/regex';

const useAmount = (initialValue, fee, account) => {
  const {
    settings: { token: { active: token } },
  } = useSelector(state => state);

  const getMaxAmount = () => fromRawLsk(Math.max(0, account.balance - fee));

  const getAmountFeedbackAndError = (value) => {
    let { message: feedback } = validateAmountFormat({ value, token });

    if (!feedback && parseFloat(getMaxAmount()) < numeral(value).value()) {
      feedback = i18n.t('Provided amount is higher than your current balance.');
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

  const onAmountInputChange = ({ target: { value } }) => {
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

  const setEntireBalance = (newFee) => {
    const value = formatAmountBasedOnLocale({
      value: getMaxAmount(),
      format: '0.[00000000]',
    });
    onAmountInputChange({ target: { value } });
    setTimeout(() => {
      if (fee !== newFee) { // Because fee can change based on amount
        setEntireBalance();
      }
    }, 1);
  };

  return [amountField, onAmountInputChange, setEntireBalance];
};

export default useAmount;
