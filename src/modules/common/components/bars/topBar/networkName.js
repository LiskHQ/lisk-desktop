import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TertiaryButton } from 'src/theme/buttons';
import Dropdown from 'src/theme/Dropdown/dropdown';
import Icon from 'src/theme/Icon';

import { networkSelected } from 'src/redux/actions';
import { networkKeys } from '@network/configuration/networks';
import { getNetworkName } from '@network/utils/getNetwork';
import styles from './network.css';

const Network = () => {
  const network = useSelector((state) => state.network);
  const dispatch = useDispatch();
  const activeNetworkName = getNetworkName(network);
  const { t } = useTranslation();

  const statusColor = network.status.online ? styles.online : styles.offline;

  const setActiveNetwork = (name) => {
    dispatch(networkSelected({ name }));
  };

  const activeNetworkIndex = useMemo(
    () => Object.values(networkKeys).indexOf(activeNetworkName),
    [activeNetworkName]
  );

  return (
    <div >
      <Dropdown
        item={() => (
          <TertiaryButton className={styles.wrapper}>
            <span className={`${styles.status} ${statusColor}`} />
            <div className={styles.message}>
              <span className="network-name">{t(activeNetworkName)}</span>
              <Icon name="dropdownArrowIcon" />
            </div>
          </TertiaryButton>
        )}
        active={activeNetworkIndex}
        className={styles.dropdown}
        title={t('Select network')}
      >
        {Object.values(networkKeys).map((networkName) => (
          <button
            key={networkName}
            className={styles.networkItem}
            onClick={() => setActiveNetwork(networkName)}
          >
            {t(networkName)}
          </button>
        ))}
      </Dropdown>
    </div>
  );
};

export default Network;
