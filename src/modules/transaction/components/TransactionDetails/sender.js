import React from 'react';
import { getModuleCommandSenderLabel } from '@transaction/utils/moduleCommand';
import { getValidatorName } from '@transaction/utils';
import { extractAddressFromPublicKey } from '@wallet/utils/account';
import WalletInfo from '../WalletInfo';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';

const Sender = () => {
  const { activeToken, transaction, network } = React.useContext(TransactionDetailsContext);
  const validatorName = getValidatorName(transaction, activeToken);
  const senderLabel = getModuleCommandSenderLabel()[transaction.moduleCommand];
  const address = extractAddressFromPublicKey(transaction.senderPublicKey);

  return (
    <WalletInfo
      className={`${styles.value} ${styles.sender}`}
      name={validatorName}
      token={activeToken}
      network={network}
      address={address}
      addressClass="sender-address"
      label={senderLabel}
    />
  );
};

export default Sender;
