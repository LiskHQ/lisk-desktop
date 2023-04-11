import React from 'react';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import { truncateAddress } from '@wallet/utils/account';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './styles.css';

const TransactionId = ({ t }) => {
  const {
    transaction: { id },
  } = React.useContext(TransactionDetailsContext);

  if (!id) {
    return null;
  }

  return (
    <ValueAndLabel label={t('Transaction ID')} className={styles.transactionId}>
      <span className="transaction-id">
        <CopyToClipboard
          text={truncateAddress(id)}
          value={id}
          className="tx-id"
          containerProps={{
            size: 'xs',
            className: 'copy-title',
          }}
          copyClassName={styles.copyIcon}
        />
      </span>
    </ValueAndLabel>
  );
};

export default TransactionId;
