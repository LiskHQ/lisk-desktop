import React from 'react';
import ReactJson from 'react-json-view';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';

const PrettyJson = ({ t }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);
  return (
    transaction &&
    Object.keys(transaction.params).length > 0 && (
      <div className={styles.transactionParams}>
        <p className={styles.label}>{t('Transaction params')}</p>
        <div>
          <ReactJson src={transaction.params} />
        </div>
      </div>
    )
  );
};

export default PrettyJson;
