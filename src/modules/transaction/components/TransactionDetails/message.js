import React from 'react';
import { getTxAsset } from '@transaction/utils';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './styles.css';

const Message = ({ t }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);

  return (
    <ValueAndLabel label={t('Message')} className={styles.message}>
      <div className="tx-reference">{getTxAsset(transaction)}</div>
    </ValueAndLabel>
  );
};

export default Message;
