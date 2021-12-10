import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { validateAmountFormat } from '@utils/validators';
import { selectSearchParamValue } from '@utils/searchParams';
import { selectAccountBalance, selectLSKAddress } from '@store/selectors';
import { tokenMap, regex } from '@constants';

let loaderTimeout = null;

/**
 * Returns error and feedback of vote amount field.
 *
 * @param {String} value - The vote amount value in Beddows
 * @param {String} balance - The account balance value in Beddows
 // * @param {Boolean} selfVote - If the delegate is voting for self or another delegate
 * @param {String} unconfirmedVotes - The vote amount value in Beddows
 * @returns {Object} The boolean error flag and a human readable message.
 */
const getAmountFeedbackAndError = (value, balance, unconfirmedVotes) => {
  const { message: feedback } = validateAmountFormat({
    value,
    token: tokenMap.LSK.key,
    funds: parseInt(balance, 10),
    checklist: ['FORMAT', 'ZERO', 'VOTE_10X', 'INSUFFICIENT_FUNDS', 'VOTES_MAX', 'LOCKED_VOTES_MAX', 'LOCKED_BALANCE_MAX'],
    initialVote: unconfirmedVotes,
  });

  return { error: !!feedback, feedback };
};

/**
 * Formats and defines potential errors of the vote mount value
 * Also provides a setter function
 *
 * @param {String} initialValue - The initial vote amount value in Beddows
 * @returns {[Boolean, Function]} The error flag, The setter function
 */
// eslint-disable-next-line max-statements
const useVoteAmountField = (initialValue) => {
  const { i18n } = useTranslation();
  const balance = useSelector(selectAccountBalance);
  const host = useSelector(selectLSKAddress);
  const searchDetails = window.location.href.replace(/.*[?]/, '');
  const address = selectSearchParamValue(`?${searchDetails}`, 'address');
  const existingVote = useSelector(state => state.voting[address || host]);
  const previouslyConfirmedVotes = existingVote ? existingVote.confirmed : 0;
  const [amountField, setAmountField] = useState({
    value: initialValue,
    isLoading: false,
    feedback: '',
    error: false,
  });

  useEffect(() => {
    if (!amountField.value && initialValue) {
      setAmountField({
        value: initialValue,
        isLoading: false,
        error: false,
        feedback: '',
      });
    }
  }, [initialValue]);

  const onAmountInputChange = ({ value }) => {
    const { leadingPoint } = regex.amount[i18n.language];
    value = leadingPoint.test(value) ? `0${value}` : value;
    clearTimeout(loaderTimeout);

    setAmountField({
      ...amountField,
      value,
      isLoading: true,
    });
    const feedback = getAmountFeedbackAndError(value, balance, previouslyConfirmedVotes);
    loaderTimeout = setTimeout(() => {
      setAmountField({
        isLoading: false,
        value,
        ...feedback,
      });
    }, 300);
  };

  return [amountField, onAmountInputChange];
};

export default useVoteAmountField;
