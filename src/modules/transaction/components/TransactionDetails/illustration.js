import React from 'react';
import { getModuleAssetTitle } from '@transaction/utils/moduleAssets';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import TransactionTypeFigure from '../TransactionTypeFigure';
import styles from './TransactionDetails.css';

const Illustration = () => {
  const params = React.useContext(TransactionDetailsContext);
  const {
    transaction: { sender, moduleAssetId },
  } = params;
  const title = getModuleAssetTitle()[moduleAssetId];

  return (
    <div className={styles.illustration}>
      <TransactionTypeFigure
        address={sender.address}
        moduleAssetId={moduleAssetId}
        iconOnly
      />
      <h2 className="tx-header">{title}</h2>
    </div>
  );
};

export default Illustration;
