import React from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'src/utils/helpers';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import styles from './txComposer.css';

// eslint-disable-next-line max-statements
const Feedback = ({ feedback, amountAndBalances, enableMinimumBalanceFeedback, token = {} }) => {
  const { t } = useTranslation();
  const { transactionAmount, availableBalance, spendingBalance } = amountAndBalances;
  const isOverspending = spendingBalance > availableBalance;
  const usableBalance = transactionAmount - (spendingBalance - availableBalance);
  let message = feedback?.[0];

  if (isOverspending && enableMinimumBalanceFeedback) {
    message = t(
      'To complete this transaction, deposit at least {{usableBalance}} {{token}} into the account, which currently has a balance of {{availableBalance}} {{token}}.',
      {
        availableBalance: convertFromBaseDenom(availableBalance, token),
        usableBalance: convertFromBaseDenom(spendingBalance - availableBalance, token),
        token: token.symbol,
      }
    );
  } else if (isOverspending) {
    message = t(
      'The provided amount exceeds the available balance {{availableBalance}} {{token}}, so the maximum usable balance is {{usableBalance}} {{token}}.',
      {
        usableBalance: convertFromBaseDenom(usableBalance, token),
        availableBalance: convertFromBaseDenom(availableBalance, token),
        token: token.symbol,
      }
    );
  }

  if (!message && isEmpty(feedback)) {
    return null;
  }

  return (
    <div className={`${styles.feedback} form feedback`}>
      <span>{message}</span>
    </div>
  );
};

export default Feedback;
