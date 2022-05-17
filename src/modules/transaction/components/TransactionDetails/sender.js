import React from 'react';
import { getModuleAssetSenderLabel } from '@transaction/utils/moduleAssets';
import { getDelegateName } from '@transaction/utils';
import WalletInfo from '../WalletInfo';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './TransactionDetails.css';

const Sender = () => {
  const { activeToken, transaction, network } = React.useContext(
    TransactionDetailsContext,
  );
  const delegateName = getDelegateName(transaction, activeToken);
  const senderLabel = getModuleAssetSenderLabel()[transaction.moduleAssetId];

  return (
    <WalletInfo
      className={`${styles.value} ${styles.sender}`}
      name={delegateName}
      token={activeToken}
      network={network}
      address={transaction.sender.address}
      addressClass="sender-address"
      label={senderLabel}
    />
  );
};

export default Sender;
