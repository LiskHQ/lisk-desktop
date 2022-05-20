import React from 'react';
import ReactJson from 'react-json-view';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';

const PrettyJson = ({ t }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);
  return (
    transaction && (
      <>
        <p className={styles.label}>{t('Transaction asset')}</p>
        <div className={styles.transactionAsset}>
          <ReactJson src={transaction.asset} />
        </div>
      </>
    )
  );
};

export default PrettyJson;
