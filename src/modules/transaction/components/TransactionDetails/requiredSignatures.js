import React from 'react';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './styles.css';

const RequiredSignatures = ({ t }) => {
  const {
    transaction: { asset },
  } = React.useContext(TransactionDetailsContext);
  const requiredSignatures = asset.numberOfSignatures;

  return (
    <ValueAndLabel
      className={styles.requiredSignatures}
      label={t('Required signatures')}
    >
      <span className="tx-required-signatures">{requiredSignatures}</span>
    </ValueAndLabel>
  );
};

export default RequiredSignatures;
