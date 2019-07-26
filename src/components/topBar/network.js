import React from 'react';
import Lisk from '@liskhq/lisk-client';
import networks from '../../constants/networks';
import styles from './network.css';

const Network = ({ network, t, token }) => {
  const networksList = {
    Mainnet: 'Mainnet',
    Testnet: 'Testnet',
    'Custom Node': 'Devnet',
  };

  let activeNetwork = '';
  if (network.name === networks.customNode.name && token !== 'BTC') {
    activeNetwork = network.networks[token].nethash === Lisk.constants.MAINNET_NETHASH
      ? networks.mainnet.code
      : network.name;
    activeNetwork = network.networks[token].nethash === Lisk.constants.TESTNET_NETHASH
      ? networks.testnet.code
      : network.name;
  }

  if (network.name === networks.customNode.name && token === 'BTC') {
    activeNetwork = token === 'BTC' ? networks.testnet.name : network.name;
  }

  const statusColor = network.name ? styles.online : styles.offline;

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
