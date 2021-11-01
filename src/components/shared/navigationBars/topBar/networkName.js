import React from 'react';

import { networkKeys } from '@constants';
import { getNetworkName } from '@utils/getNetwork';
import Tooltip from '@toolbox/tooltip/tooltip';
import styles from './network.css';

const Network = ({ network, t, token }) => {
  const networksList = {
    [networkKeys.mainNet]: t('Mainnet').toLowerCase(),
    [networkKeys.testNet]: t('Testnet').toLowerCase(),
    [networkKeys.customNode]: t('Devnet').toLowerCase(),
  };
  const activeNetwork = getNetworkName(network);
  const statusColor = network.status.online ? styles.online : styles.offline;

  return (
    <section className={`${styles.wrapper} network-status`}>
      <span className={`${styles.status} ${statusColor}`} />
      <div className={styles.message}>
        <span>{t('Connected to:')}</span>
        <Tooltip
          className={styles.tooltipWrapper}
          size="maxContent"
          position="bottom left"
          content={(
            <span className="network-name">{networksList[activeNetwork]}</span>
          )}
        >
          <p className="network-address">
            {
              network.networks
                ? network.networks[token]?.serviceUrl
                : '-'
            }
          </p>
        </Tooltip>
      </div>
    </section>
  );
};

export default Network;
