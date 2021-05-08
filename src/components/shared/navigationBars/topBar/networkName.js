import React from 'react';
import { getNetworkNameBasedOnNethash } from '../../../../utils/getNetwork';
import styles from './network.css';

const Network = ({ network, t, token }) => {
  const networksList = {
    Mainnet: t('Mainnet').toLowerCase(),
    Testnet: t('Testnet').toLowerCase(),
    'Custom Node': t('Custom').toLowerCase(),
  };

  const activeNetwork = getNetworkNameBasedOnNethash(network, token);

  const statusColor = network.status.online ? styles.online : styles.offline;

  return (
    <section className={`${styles.wrapper} network-status`}>
      <span className={`${styles.status} ${statusColor}`} />
      {
        activeNetwork ? (
          <p>
            <span>{t('Connected to:')}</span>
            <span>{networksList[activeNetwork]}</span>
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
