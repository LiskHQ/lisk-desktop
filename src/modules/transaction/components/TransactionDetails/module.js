import React from 'react';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './styles.css';

const Module = ({ t }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);

  return (
    <ValueAndLabel label={t('Module')} className={styles.module}>
      <div className="tx-module">{transaction.module}</div>
    </ValueAndLabel>
  );
};

export default Module;
