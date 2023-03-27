import React from 'react';
import WalletInfo from '../WalletInfo';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';

const Recipient = ({ t }) => {
  const { activeToken, network, transaction } = React.useContext(TransactionDetailsContext);

  return (
    <WalletInfo
      className={`${styles.value} ${styles.recipient}`}
      token={activeToken}
      network={network}
      address={transaction.params.recipientAddress}
      addressClass="receiver-address"
      label={t('Recipient')}
    />
  );
};

export default Recipient;
