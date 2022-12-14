import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { validateAmountFormat } from 'src/utils/validators';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { selectLSKAddress } from 'src/redux/selectors';
import { regex } from 'src/const/regex';
import { tokenMap } from '@token/fungible/consts/tokens';
import { useTokensBalance } from 'src/modules/token/fungible/hooks/queries';
import { usePosConstants } from './queries';

let loaderTimeout = null;

/**
 * Returns error and feedback of vote amount field.
 *
 * @param {String} value - The vote amount value difference in Beddows
 * @param {String} balance - The account balance value in Beddows
 * @param {String} minValue - The minimum value checker in Beddows
 * @param {String} inputValue - The input vote amount value in Beddows
 * @returns {Object} The boolean error flag and a human readable message.
 */
const getAmountFeedbackAndError = (value, balance, minValue, inputValue) => {
  const { message: feedback } = validateAmountFormat({
    value: +value,
    token: tokenMap.LSK.key,
    funds: parseInt(balance, 10),
    checklist: [
      'NEGATIVE_VOTE',
      'ZERO',
      'STAKE_10X',
      'INSUFFICIENT_VOTE_FUNDS',
      'MIN_BALANCE',
      'FORMAT',
    ],
    minValue,
    inputValue,
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
  // @TODO: we need to change the caching time from 5mins to something larger since this is a constant that doesn't frequently change
  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();

  // Since we know the dposTokenId we need to get the token's object
  const { data: tokens, isLoading: isGettingDposToken } = useTokensBalance({
    config: { params: { tokenID: posConstants?.tokenIDDPoS } },
    options: { enabled: !isGettingPosConstants },
  });
  const token = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  const { i18n } = useTranslation();
  const balance = Number(token.availableBalance || 0);
  // const balance = useSelector(selectAccountBalance); // @todo account has multiple balance now
  const host = useSelector(selectLSKAddress);
  const searchDetails = window.location.href.replace(/.*[?]/, '');
  const address = selectSearchParamValue(`?${searchDetails}`, 'address');
  const voting = useSelector((state) => state.voting);
  const existingVote = voting[address || host];
  const totalUnconfirmedVotes = Object.values(voting)
    .filter((vote) => vote.confirmed < vote.unconfirmed)
    .map((vote) => vote.unconfirmed - vote.confirmed)
    .reduce((total, amount) => total + amount, 0);
  const previouslyConfirmedVotes = existingVote ? existingVote.confirmed : 0;
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
      value - fromRawLsk(previouslyConfirmedVotes - totalUnconfirmedVotes),
      balance,
      -1 * fromRawLsk(previouslyConfirmedVotes),
      value
    );
    loaderTimeout = setTimeout(() => {
      setAmountField({
        isLoading: false,
        value,
        ...feedback,
      });
    }, 300);
  };

  return [amountField, onAmountInputChange, isGettingDposToken];
};

export default useVoteAmountField;
