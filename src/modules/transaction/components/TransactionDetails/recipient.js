import React from 'react';
import WalletInfo from '../WalletInfo';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './TransactionDetails.css';

const Recipient = ({ t }) => {
  const { activeToken, network, transaction } = React.useContext(
    TransactionDetailsContext,
  );

  return (
    <WalletInfo
      className={`${styles.value} ${styles.recipient}`}
      token={activeToken}
      network={network}
      address={transaction.asset.recipient.address}
      addressClass="receiver-address"
      label={t('Recipient')}
    />
  );
};

export default Recipient;
