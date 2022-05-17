import React from 'react';
import TokenAmount from '@token/fungible/components/tokenAmount';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './TransactionDetails.css';

const Fee = ({ t }) => {
  const {
    activeToken,
    transaction: { fee },
  } = React.useContext(TransactionDetailsContext);

  return (
    <ValueAndLabel label={t('Transaction fee')} className={styles.fee}>
      <span className="tx-fee">
        <TokenAmount val={fee} token={activeToken} />
      </span>
    </ValueAndLabel>
  );
};

export default Fee;
