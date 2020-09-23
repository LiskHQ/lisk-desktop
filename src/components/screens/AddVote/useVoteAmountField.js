import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import numeral from 'numeral';
// import { useSelector } from 'react-redux';

// import { toRawLsk } from '../../../utils/lsk';
import { validateAmountFormat } from '../../../utils/validators';
import regex from '../../../utils/regex';

let loaderTimeout = null;

/**
 * Returns error and feedback of vote amount field.
 *
 * @param {String} value - The vote amount value in Beddows
 * @param {Number} maxAmount - The vote amount cap/max in Beddows
 * @param {Function} t - i18n.t
 * @returns {Object} The boolean error flag and a human readable message.
 */
const getAmountFeedbackAndError = (value) => {
  const { message: feedback } = validateAmountFormat({ value, token: tokenMap.LSK.key });

  // if (!feedback && maxAmount < toRawLsk(numeral(value).value())) {
  //   feedback = t('Provided vote amount is higher than your free balance.');
  // }
  return { error: !!feedback, feedback };
};

/**
 * Calculates the maximum free/available balance to use for voting,
 * Accounts for votes in vote queue and voting fee cap
 *
 * @param {Object} state - The Redux state
 * @returns {Number} - Available balance
 */
// const getMaxAmount = (state) => {
//   const { balance } = state.account.info.LSK;
//   const totalUnconfirmedVotes = Object.values(state.voting)
//     .map(vote => Math.max(vote.confirmed, vote.unconfirmed))
//     .reduce((total, amount) => (total + amount), 0);

//   return balance - totalUnconfirmedVotes - 1e8; // only considering fee cap
// };

/**
 * Formats and defines potential errors of the vote mount value
 * Also provides a setter function
 *
 * @param {String} initialValue - The initial vote amount value in Beddows
 * @returns {[Boolean, Function]} The error flag, The setter function
 */
const useVoteAmountField = (initialValue) => {
  const { i18n } = useTranslation();
  const [amountField, setAmountField] = useState({
    value: initialValue,
    isLoading: false,
    feedback: '',
    error: false,
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
        isLoading: false,
        value,
        ...getAmountFeedbackAndError(value),
      });
    }, 300);
  };

  return [amountField, onAmountInputChange];
};

export default useVoteAmountField;
