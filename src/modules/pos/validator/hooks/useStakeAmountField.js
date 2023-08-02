import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { validateAmount } from 'src/utils/validators';
import { convertFromBaseDenom, convertToBaseDenom } from '@token/fungible/utils/helpers';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { selectLSKAddress } from 'src/redux/selectors';
import { regex } from 'src/const/regex';
import usePosToken from './usePosToken';

let loaderTimeout = null;

/**
 * Returns error and feedback of stake amount field.
 */
// eslint-disable-next-line max-statements
const getAmountFeedbackAndError = (
  balance,
  minValue,
  inputValue,
  token,
  previouslyConfirmedStake
) => {
  const stakedValue = convertToBaseDenom(inputValue, token) - previouslyConfirmedStake;

  const stakeAmountChecklist = stakedValue > 0 ? ['INSUFFICIENT_STAKE_FUNDS', 'MIN_BALANCE'] : [];
  const inputAmountChecklist = ['NEGATIVE_STAKE', 'STAKE_10X', 'FORMAT'];
  const { message } = validateAmount({
    token,
    minValue,
    inputValue: convertFromBaseDenom(Math.abs(stakedValue)),
    checklist: stakeAmountChecklist,
    amount: parseInt(convertFromBaseDenom(Math.abs(stakedValue)), 10),
    accountBalance: parseInt(balance, 10),
  });

  const { message: inputAmountMessage } = validateAmount({
    token,
    minValue,
    inputValue,
    checklist: inputAmountChecklist,
    amount: inputValue,
    accountBalance: parseInt(balance, 10),
  });

  return {
    error: !!message || !!inputAmountMessage,
    feedback: message || inputAmountMessage,
  };
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
      value,
      token,
      previouslyConfirmedStake
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
