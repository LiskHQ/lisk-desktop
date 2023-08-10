import React from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'src/utils/helpers';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import styles from './txComposer.css';

const Feedback = ({ minRequiredBalance, feedback, token = {} }) => {
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
        minRequiredBalance: convertFromBaseDenom(minRequiredBalance, token),
      });
  return (
    <div className={`${styles.feedback} feedback`}>
      <span>{message}</span>
    </div>
  );
};

export default Feedback;
