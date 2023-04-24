import React from 'react';
import GenericTxParams from '@transaction/components/GenericTxParams';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './styles.css';

const GenericParams = ({ t }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);
  return (
    <ValueAndLabel label={t('Params')} className={styles.genericParams}>
      <div className={styles.structuredAssets}>
        <GenericTxParams transaction={transaction} />
      </div>
    </ValueAndLabel>
  );
};

export default GenericParams;
