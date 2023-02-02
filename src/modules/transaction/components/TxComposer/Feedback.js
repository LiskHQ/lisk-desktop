import React from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'src/utils/helpers';
import { convertToDenom } from '@token/fungible/utils/lsk';
import { getTxAmount } from '@transaction/utils/transaction';
import styles from './txComposer.css';

export const getMinRequiredBalance = (transaction, fee) =>
  BigInt(fee) + BigInt(getTxAmount(transaction) || 0);

const Feedback = ({ minRequiredBalance, feedback, token }) => {
  const { t } = useTranslation();
  const hasMinRequiredBalance =
    BigInt(minRequiredBalance || 0) <= BigInt(token.availableBalance || 0);

  if (hasMinRequiredBalance && isEmpty(feedback)) {
    return null;
  }

  const message = hasMinRequiredBalance
    ? feedback[0]
    : t('The minimum required balance for this action is {{minRequiredBalance}} {{token}}', {
        token: token.symbol,
        minRequiredBalance: convertToDenom(minRequiredBalance, token),
      });
  return (
    <div className={`${styles.feedback} feedback`}>
      <span>{message}</span>
    </div>
  );
};

export default Feedback;
