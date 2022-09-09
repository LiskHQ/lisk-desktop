import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectActiveToken } from 'src/redux/selectors';
import { isEmpty } from 'src/utils/helpers';
import { toRawLsk, fromRawLsk } from '@token/fungible/utils/lsk';
import { dustThreshold } from '@wallet/configuration/constants';
import { getTxAmount } from '@transaction/utils/transaction';
import styles from './txComposer.css';

export const getMinRequiredBalance = (transaction, fee) =>
  toRawLsk(fee.value) + dustThreshold + (getTxAmount(transaction) || 0);

const Feedback = ({ minRequiredBalance, balance, feedback }) => {
  const { t } = useTranslation();
  const token = useSelector(selectActiveToken);
  if (minRequiredBalance <= balance && isEmpty(feedback)) {
    return null;
  }
  const message =
    minRequiredBalance <= balance
      ? feedback[0]
      : t('The minimum required balance for this action is {{minRequiredBalance}} {{token}}', {
          token,
          minRequiredBalance: fromRawLsk(minRequiredBalance),
        });
  return (
    <div className={`${styles.feedback} feedback`}>
      <span>{message}</span>
    </div>
  );
};

export default Feedback;
