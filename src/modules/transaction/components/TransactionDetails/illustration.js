import React from 'react';
import { getModuleCommandTitle } from '@transaction/utils/moduleAssets';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import TransactionTypeFigure from '../TransactionTypeFigure';
import styles from './styles.css';

const Illustration = () => {
  const params = React.useContext(TransactionDetailsContext);
  const {
    transaction: { sender, moduleCommandID },
  } = params;
  const title = getModuleCommandTitle()[moduleCommandID];

  return (
    <div className={styles.illustration}>
      <TransactionTypeFigure
        address={sender.address}
        moduleCommandID={moduleCommandID}
        iconOnly
      />
      <h2 className="tx-header">{title}</h2>
    </div>
  );
};

export default Illustration;
