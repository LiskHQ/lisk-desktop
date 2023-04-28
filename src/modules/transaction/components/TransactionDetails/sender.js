import React from 'react';
import { getModuleCommandSenderLabel } from '@transaction/utils/moduleCommand';
import { getValidatorName } from '@transaction/utils';
import { extractAddressFromPublicKey } from '@wallet/utils/account';
import WalletInfo from '../WalletInfo';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';
import ValueAndLabel from './valueAndLabel';

const Sender = ({ t }) => {
  const { activeToken, transaction, network } = React.useContext(TransactionDetailsContext);
  const validatorName = getValidatorName(transaction, activeToken);
  const senderLabel = getModuleCommandSenderLabel()[transaction.moduleCommand];
  const address = extractAddressFromPublicKey(transaction.senderPublicKey);

  return (
    <ValueAndLabel label={t(senderLabel)} className={styles.sender}>
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
