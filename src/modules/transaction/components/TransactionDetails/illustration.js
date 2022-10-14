import React from 'react';
import { getModuleCommandTitle } from 'src/modules/transaction/utils/moduleCommand';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import TransactionTypeFigure from '../TransactionTypeFigure';
import styles from './styles.css';

const Illustration = () => {
  const params = React.useContext(TransactionDetailsContext);
  const {
    transaction: { sender, moduleCommand },
  } = params;
  const title = getModuleCommandTitle()[moduleCommand];

  return (
    <div className={styles.illustration}>
      <TransactionTypeFigure
        address={sender.address}
        moduleCommand={moduleCommand}
        iconOnly
      />
      <h2 className="tx-header">{title}</h2>
    </div>
  );
};

export default Illustration;
