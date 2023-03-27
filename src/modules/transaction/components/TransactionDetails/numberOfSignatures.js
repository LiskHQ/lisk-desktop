import React from 'react';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './styles.css';

const NumberOfSignatures = ({ t }) => {
  const {
    transaction: { params },
  } = React.useContext(TransactionDetailsContext);
  const numberOfSignatures = params.numberOfSignatures;

  return (
    <ValueAndLabel className={styles.numberOfSignatures} label={t('Required signatures')}>
      <span className="tx-required-signatures">{numberOfSignatures}</span>
    </ValueAndLabel>
  );
};

export default NumberOfSignatures;
