import React from 'react';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './TransactionDetails.css';

const Nonce = ({ t }) => {
  const {
    transaction: { nonce },
  } = React.useContext(TransactionDetailsContext);

  return (
    <ValueAndLabel className={styles.nonce} label={t('Nonce')}>
      <span>{nonce}</span>
    </ValueAndLabel>
  );
};

export default Nonce;
