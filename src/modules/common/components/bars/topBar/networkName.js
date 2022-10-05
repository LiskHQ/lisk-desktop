import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Dropdown from 'src/theme/Dropdown/dropdown';
import Icon from 'src/theme/Icon';

import { networkSelected } from 'src/redux/actions';
import { networkKeys } from '@network/configuration/networks';
import { getNetworkName } from '@network/utils/getNetwork';
import styles from './network.css';

const Network = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const network = useSelector(state => state.network);
  const dispatch = useDispatch()
  const activeNetwork = getNetworkName(network);
  const { t } = useTranslation()

  const statusColor = network.status.online ? styles.online : styles.offline;

  const closeDropdown = () => {
    setShowDropdown(false)
  }

  const setActiveNetwork = name => {
    dispatch(networkSelected({ name }))
    closeDropdown();
  }

  const activeNetworkIndex = useMemo(() => Object.values(networkKeys).indexOf(activeNetwork), [activeNetwork])

  return (
    <>
      <section className={styles.wrapper} onClick={() => setShowDropdown(true)}>
        <span className={`${styles.status} ${statusColor}`} />
        <div className={styles.message}>
          <span>{activeNetwork}</span>
          <Icon name="dropdownArrowIcon" />
        </div>
      </section>
      <Dropdown showDropdown={showDropdown} active={activeNetworkIndex} className={styles.dropdown} closeDropdown={closeDropdown} title={t('Select network')}>
        {Object.values(networkKeys).map(networkName => <button key={networkName} className={styles.networkItem} onClick={() => setActiveNetwork(networkName)}>{t(networkName)}</button>)}
      </Dropdown>
    </>
  );
};

export default Network;
