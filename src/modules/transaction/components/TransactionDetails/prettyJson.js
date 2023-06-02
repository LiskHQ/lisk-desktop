import React from 'react';
import ReactJson from 'react-json-view';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';

const PrettyJson = ({ t }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);
  return (
    transaction && Object.keys(transaction.params).length > 0 && (
      <>
        <p className={styles.label}>{t('Transaction params')}</p>
        <div className={styles.transactionParams}>
          <ReactJson src={transaction.params} />
        </div>
      </>
    )
  );
};

export default PrettyJson;
