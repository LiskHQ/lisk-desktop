import React from 'react';
import {
  getModuleCommandSenderLabel,
  joinModuleAndCommand,
} from '@transaction/utils/moduleCommand';
import { getValidatorName } from '@transaction/utils';
import { extractAddressFromPublicKey } from '@wallet/utils/account';
import WalletInfo from '../WalletInfo';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';
import ValueAndLabel from './valueAndLabel';

const Sender = () => {
  const { activeToken, transaction, network } = React.useContext(TransactionDetailsContext);
  const validatorName = getValidatorName(transaction, activeToken);
  const moduleCommand = joinModuleAndCommand(transaction);
  const senderLabel = getModuleCommandSenderLabel()[moduleCommand] || 'Sender';
  const address = extractAddressFromPublicKey(transaction.senderPublicKey);

  return (
    <ValueAndLabel label={senderLabel} className={styles.sender}>
      <WalletInfo
        className={styles.value}
        name={validatorName}
        token={activeToken}
        network={network}
        address={address}
        addressClass="sender-address"
      />
    </ValueAndLabel>
  );
};

export default Sender;
