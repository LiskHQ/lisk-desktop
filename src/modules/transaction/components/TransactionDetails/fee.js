import React from 'react';
import TokenAmount from '@token/fungible/components/tokenAmount';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './styles.css';

const Fee = ({ t }) => {
  const {
    token,
    transaction: { fee },
  } = React.useContext(TransactionDetailsContext);

  return (
    <ValueAndLabel label={t('Fee')} className={styles.fee}>
      <span className="tx-fee">
        {token ? <TokenAmount val={fee} token={token} /> : <span>{fee}</span>}
      </span>
    </ValueAndLabel>
  );
};

export default Fee;
