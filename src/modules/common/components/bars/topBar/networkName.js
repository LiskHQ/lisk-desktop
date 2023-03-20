/* eslint-disable max-statements */
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Tooltip from 'src/theme/Tooltip';
import useSettings from '@settings/hooks/useSettings';
import styles from './network.css';

const Network = () => {
  const { status } = useSelector((state) => state.network);
  const { mainChainNetwork } = useSettings('mainChainNetwork');
  const { t } = useTranslation();

  const activeNetworkName = mainChainNetwork?.name;
  const statusColor = status.online ? styles.online : styles.offline;

  return (
    <>
      <section className={styles.wrapper}>
        <span className={`${styles.status} ${statusColor}`} />
        <div className={styles.message}>
          <Tooltip
            indent
            alwaysShow
            tooltipClassName={styles.tooltipContainer}
            position="bottom left"
            size="maxContent"
            content={<span className="network-name">{t(activeNetworkName)}</span>}
          >
            <span>{mainChainNetwork?.serviceUrl}</span>
          </Tooltip>
        </div>
      </section>
    </>
  );
};

export default Network;
