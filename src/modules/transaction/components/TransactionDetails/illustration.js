import React from 'react';
import { getModuleCommandTitle, joinModuleAndCommand } from '@transaction/utils/moduleCommand';
import { extractAddressFromPublicKey } from '@wallet/utils/account';

import TransactionDetailsContext from '../../context/transactionDetailsContext';
import TransactionTypeFigure from '../TransactionTypeFigure';
import styles from './styles.css';

const Illustration = () => {
  const params = React.useContext(TransactionDetailsContext);
  const {
    transaction: { senderPublicKey, module, command },
  } = params;
  const moduleCommand = joinModuleAndCommand(module, command);
  const title = getModuleCommandTitle()[moduleCommand];
  const address = extractAddressFromPublicKey(senderPublicKey);

  return (
    <div className={styles.illustration}>
      <TransactionTypeFigure address={address} moduleCommand={moduleCommand} iconOnly />
      <h2 className="tx-header">{title}</h2>
    </div>
  );
};

export default Illustration;
