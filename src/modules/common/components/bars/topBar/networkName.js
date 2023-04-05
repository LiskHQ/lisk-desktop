/* eslint-disable max-statements */
import React from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'src/theme/Tooltip';
import useSettings from '@settings/hooks/useSettings';
import classNames from 'classnames';
import styles from './network.css';

const Network = ({ className }) => {
  const { mainChainNetwork } = useSettings('mainChainNetwork');
  const { t } = useTranslation();

  const activeNetworkName = mainChainNetwork?.name;
  const statusColor = mainChainNetwork?.isAvailable ? styles.online : styles.offline;

  return (
    <>
      <section className={classNames(styles.wrapper, className)}>
        <span className={`${styles.status} ${statusColor}`} />
        <div className={styles.message}>
          <Tooltip
            indent
            tooltipClassName={styles.tooltipContainer}
            position="bottom left"
            size="maxContent"
            content={
              <span className={classNames('network-name', styles.networkLabel)}>
                {t(activeNetworkName)}
              </span>
            }
          >
            <span>{mainChainNetwork?.serviceUrl}</span>
          </Tooltip>
        </div>
      </section>
    </>
  );
};

export default Network;
