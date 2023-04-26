import React from 'react';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './styles.css';

const Command = ({ t }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);

  return (
    <ValueAndLabel label={t('Command')} className={styles.command}>
      <div className="tx-command">{transaction.command}</div>
    </ValueAndLabel>
  );
};

export default Command;
