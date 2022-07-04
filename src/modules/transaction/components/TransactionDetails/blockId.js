import React from 'react';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import { truncateAddress } from '@wallet/utils/account';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './styles.css';

const BlockId = ({ t }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);

  return (
    <ValueAndLabel className={styles.blockId} label={t('Block ID')}>
      <span>
        <CopyToClipboard
          value={transaction.block.id}
          text={truncateAddress(transaction.block.id)}
          className="block-id"
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

export default BlockId;
