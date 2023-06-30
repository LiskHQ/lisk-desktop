import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { validateAmount } from 'src/utils/validators';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { selectLSKAddress } from 'src/redux/selectors';
import { regex } from 'src/const/regex';
import usePosToken from './usePosToken';

let loaderTimeout = null;

/**
 * Returns error and feedback of stake amount field.
 */
const getAmountFeedbackAndError = (balance, minValue, inputValue, token, unConfirmedAmount) => {
  console.log('----', { balance, minValue, inputValue, token, unConfirmedAmount });

  const checklist = [
    'NEGATIVE_STAKE',
    'ZERO',
    'STAKE_10X',
    // 'INSUFFICIENT_STAKE_FUNDS',
    'MIN_BALANCE',
    'FORMAT',
  ];

  if(unConfirmedAmount > 0)

  const { message: feedback } = validateAmount({
    token,
    amount: parseInt(inputValue, 10),
    accountBalance: parseInt(balance, 10),
    checklist,
    minValue,
    inputValue,
  });

  return { error: !!feedback, feedback };
};

/**
 * Formats and defines potential errors of the stake mount value
 * Also provides a setter function
 *
 * @param {String} initialValue - The initial stake amount value in Beddows
 * @returns {[Boolean, Function]} The error flag, The setter function
 */
// eslint-disable-next-line max-statements
const useStakeAmountField = (initialValue) => {
  const { token, isLoading: isGettingPosToken } = usePosToken();

  const { i18n } = useTranslation();
  const balance = Number(token?.availableBalance);
  const host = useSelector(selectLSKAddress);
  const searchDetails = window.location.href.replace(/.*[?]/, '');
  const address = selectSearchParamValue(`?${searchDetails}`, 'address');
  const staking = useSelector((state) => state.staking);
  const existingStake = staking[address || host];
  const previouslyConfirmedStake = existingStake ? existingStake.confirmed : 0;
  const [amountField, setAmountField] = useState({
    value: initialValue,
    isLoading: false,
    feedback: '',
    error: false,
  });

  useEffect(() => {
    if (!+amountField.value && initialValue) {
      setAmountField({
        value: initialValue,
        isLoading: false,
        error: false,
        feedback: '',
      });
    }
  }, [initialValue, token]);

  const onAmountInputChange = ({ value }) => {
    const { leadingPoint } = regex.amount[i18n.language];
    value = leadingPoint.test(value) ? `0${value}` : value;
    clearTimeout(loaderTimeout);

    setAmountField({
      ...amountField,
      value,
      isLoading: true,
    });
    const feedback = getAmountFeedbackAndError(
      balance,
      -1 * convertFromBaseDenom(previouslyConfirmedStake, token),
      BigInt(value),
      token,
      BigInt(convertFromBaseDenom(previouslyConfirmedStake, token))
    );
    loaderTimeout = setTimeout(() => {
      setAmountField({
        isLoading: false,
        value,
        ...feedback,
      });
    }, 300);
  };

  return [amountField, onAmountInputChange, isGettingPosToken];
};

export default useStakeAmountField;
