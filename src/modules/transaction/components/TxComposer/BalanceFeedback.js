import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  selectActiveToken,
} from '@common/store';
import { toRawLsk, fromRawLsk } from '@token/fungible/utils/lsk';
import { dustThreshold } from '@wallet/configuration/constants';
import { getTxAmount } from '@transaction/utils/transaction';
import styles from './txComposer.css';

export const getMinRequiredBalance = (transaction, fee) =>
  toRawLsk(fee.value) + dustThreshold + (getTxAmount(transaction) || 0);

const BalanceFeedback = ({ minRequiredBalance, balance }) => {
  const { t } = useTranslation();
  const token = useSelector(selectActiveToken);
  if (minRequiredBalance <= balance) {
    return null;
  }
  return (
    <div className={`${styles.feedback} feedback`}>
      <span>
        {
          t(
            'The minimum required balance for this action is {{minRequiredBalance}} {{token}}',
            { token, minRequiredBalance: fromRawLsk(minRequiredBalance) },
          )
        }
      </span>
    </div>
  );
};

export default BalanceFeedback;
