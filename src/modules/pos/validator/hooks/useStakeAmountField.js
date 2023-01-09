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
 * Returns error and feedback of stake amount field.
 *
 * @param {String} value - The stake amount value difference in Beddows
 * @param {String} balance - The account balance value in Beddows
 * @param {String} minValue - The minimum value checker in Beddows
 * @param {String} inputValue - The input stake amount value in Beddows
 * @returns {Object} The boolean error flag and a human readable message.
 */
const getAmountFeedbackAndError = (value, balance, minValue, inputValue) => {
  const { message: feedback } = validateAmountFormat({
    value: +value,
    token: tokenMap.LSK.key,
    funds: parseInt(balance, 10),
    checklist: [
      'NEGATIVE_STAKE',
      'ZERO',
      'STAKE_10X',
      'INSUFFICIENT_STAKE_FUNDS',
      'MIN_BALANCE',
      'FORMAT',
    ],
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
  // @TODO: we need to change the caching time from 5mins to something larger since this is a constant that doesn't frequently change
  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();

  // Since we know the dposTokenId we need to get the token's object
  const { data: tokens, isLoading: isGettingDposToken } = useTokensBalance({
    config: { params: { tokenID: posConstants?.posTokenID } },
    options: { enabled: !isGettingPosConstants },
  });
  const token = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  const { i18n } = useTranslation();
  const balance = Number(token.availableBalance || 0);
  // const balance = useSelector(selectAccountBalance); // @todo account has multiple balance now
  const host = useSelector(selectLSKAddress);
  const searchDetails = window.location.href.replace(/.*[?]/, '');
  const address = selectSearchParamValue(`?${searchDetails}`, 'address');
  const voting = useSelector((state) => state.staking);
  const existingStake = voting[address || host];
  const totalUnconfirmedStake = Object.values(voting)
    .filter((stake) => stake.confirmed < stake.unconfirmed)
    .map((stake) => stake.unconfirmed - stake.confirmed)
    .reduce((total, amount) => total + amount, 0);
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
      value - fromRawLsk(previouslyConfirmedStake - totalUnconfirmedStake),
      balance,
      -1 * fromRawLsk(previouslyConfirmedStake),
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

export default useStakeAmountField;
