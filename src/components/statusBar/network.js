import React, { Fragment } from 'react';
import Lisk from 'lisk-elements';
import networks from '../../constants/networks';
import styles from './network.css';

const Network = (props) => {
  const { peers, t, showNetworkIndicator } = props;
  const net = ['mainnet', 'testnet', 'devnet'];
  const activeNetwork = net.map(code => t(code));

  let iconCode = peers.options.code;
  if (iconCode === 2) {
    iconCode = peers.options.nethash === Lisk.constants.MAINNET_NETHASH ?
      networks.mainnet.code : iconCode;
    iconCode = peers.options.nethash === Lisk.constants.TESTNET_NETHASH ?
      networks.testnet.code : iconCode;
  }

  const statusColor = peers.status && peers.status.online ? styles.online : styles.offline;
  const shouldShowNetworkIndicator = peers.liskAPIClient &&
      (showNetworkIndicator || peers.options.code !== networks.mainnet.code);

  return (
    <section className={styles.wrapper}>
      {
        shouldShowNetworkIndicator &&
        <Fragment>
          <span className={`${styles.status} ${statusColor}`}></span>
          <p>
            {t('Connected to:')}
            <span>{activeNetwork[iconCode]}</span>
          </p>
        </Fragment>
      }
    </section>
  );
};

export default Network;
