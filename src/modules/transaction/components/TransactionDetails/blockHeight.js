import React from 'react';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './TransactionDetails.css';

const BlockHeight = ({ t }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);

  return (
    <ValueAndLabel className={styles.blockHeight} label={t('Block height')}>
      <span>{transaction.block.height}</span>
    </ValueAndLabel>
  );
};

export default BlockHeight;
