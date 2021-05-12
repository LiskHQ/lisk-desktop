import React from 'react';
import styles from './network.css';

const Network = ({ network, t }) => {
  const networksList = {
    Mainnet: t('Mainnet'),
    Testnet: t('Testnet'),
    'Custom Node': t('Custom'),
  };
  const statusColor = network.status.online ? styles.online : styles.offline;

  return (
    <section className={`${styles.wrapper} network-status`}>
      <span className={`${styles.status} ${statusColor}`} />
      {
        network.name ? (
          <p>
            <span>{t('Connected to:')}</span>
            <span>{networksList[network.name]}</span>
          </p>
        ) : (
          <p>
            <span>{t('Not connected')}</span>
          </p>
        )
      }
    </section>
  );
};

export default Network;
