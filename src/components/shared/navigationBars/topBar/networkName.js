import React from 'react';
import { networkKeys } from '@constants';
import { getNetworkNameBasedOnNethash } from '@utils/getNetwork';
import styles from './network.css';

const Network = ({ network, t, token }) => {
  const networksList = {
    [networkKeys.mainNet]: t('Mainnet').toLowerCase(),
    [networkKeys.testNet]: t('Testnet').toLowerCase(),
    [networkKeys.customNode]: t('Devnet').toLowerCase(),
  };
  const activeNetwork = getNetworkNameBasedOnNethash(network, token);
  const statusColor = network.status.online ? styles.online : styles.offline;

  return (
    <section className={`${styles.wrapper} network-status`}>
      <span className={`${styles.status} ${statusColor}`} />
      <p>
        <span>{t('Connected to:')}</span>
        <span>{networksList[activeNetwork]}</span>
      </p>
    </section>
  );
};

export default Network;
