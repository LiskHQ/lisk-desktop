/* eslint-disable max-statements */
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Dropdown from 'src/theme/Dropdown/dropdown';
import Icon from 'src/theme/Icon';
import networks, { networkKeys } from '@network/configuration/networks';
import useSettings from '@settings/hooks/useSettings';
import styles from './network.css';

const Network = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { status } = useSelector((state) => state.network);
  const { mainChainNetwork, setValue } = useSettings('mainChainNetwork');
  const { t } = useTranslation();

  const activeNetworkName = mainChainNetwork?.name;
  const statusColor = status.online ? styles.online : styles.offline;

  const closeDropdown = () => setShowDropdown(false);

  const setActiveNetwork = (name) => {
    setValue(networks[name]);
    closeDropdown();
  };

  const activeNetworkIndex = useMemo(
    () => Object.values(networkKeys).indexOf(activeNetworkName),
    [activeNetworkName]
  );

  return (
    <>
      <section className={styles.wrapper} onClick={() => setShowDropdown(true)}>
        <span className={`${styles.status} ${statusColor}`} />
        <div className={styles.message}>
          <span className="network-name">{t(activeNetworkName)}</span>
          <Icon name="dropdownArrowIcon" />
        </div>
      </section>
      <Dropdown
        showDropdown={showDropdown}
        active={activeNetworkIndex}
        className={styles.dropdown}
        closeDropdown={closeDropdown}
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
    </>
  );
};

export default Network;
