import React from 'react';
import TokenAmount from '@token/fungible/components/tokenAmount';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './styles.css';

const Fee = ({ t }) => {
  const {
    transaction: {
      params: { messageFee },
    },
  } = React.useContext(TransactionDetailsContext);

  return (
    <ValueAndLabel label={t('Message Fee')} className={styles.messageFee}>
      <span className="tx-message-fee">
        <TokenAmount val={messageFee} isLsk />
      </span>
    </ValueAndLabel>
  );
};

export default Fee;
