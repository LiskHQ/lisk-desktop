/* eslint-disable complexity, max-statements */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuSelect from '@wallet/components/MenuSelect';
import useSettings from '@settings/hooks/useSettings';
import NetworkMenuItem from '@network/components/networkSwitcherDropdown/networkMenuItem/NetworkMenuItem';
import networks from '../../configuration/networks';
import styles from './NetworkSwitcherDropdown.css';

function NetworkSwitcherDropdown({ noLabel, onNetworkSwitchSuccess }) {
  const { t } = useTranslation();
  const { setValue, mainChainNetwork } = useSettings('mainChainNetwork');
  const [selectedNetwork, setSelectedNetwork] = useState(mainChainNetwork);
  const {
    mainChainNetwork: { name: currentNetworkName },
  } = useSettings('mainChainNetwork');
  const networksWithCustomNetworks = [...Object.values(networks)];


  const networkStatus = {
    isSuccess: true,
    isFetching: false,
  };

  const handleChangeNetwork = (network) => {
    setSelectedNetwork(network);
    setValue(network);
  }

  useEffect(() => {
    const isSuccess = networkStatus.isSuccess && !networkStatus.isFetching;
    onNetworkSwitchSuccess?.(isSuccess);
  }, [networkStatus.isSuccess, networkStatus.isFetching]);

  return (
    <div className={styles.NetworkSwitcherDropdown}>
      <div className={styles.networkSelectionWrapper}>
        {!noLabel && <label className={styles.label}>{t('Switch network')}</label>}
        <MenuSelect
          value={selectedNetwork}
          select={(selectedValue, option) => selectedValue.label === option?.label}
          onChange={handleChangeNetwork}
          popupClassName={styles.networksPopup}
          className={styles.menuSelect}
          isLoading={false}
        >
          {Object.keys(networksWithCustomNetworks)
            .filter((networkKey) => networksWithCustomNetworks[networkKey].isAvailable)
            .map((networkKey) => {
              const network = networksWithCustomNetworks[networkKey];
              return (
                <NetworkMenuItem
                  className={styles.networkItemProp}
                  key={network.label}
                  selectedNetwork={selectedNetwork}
                  currentNetworkName={currentNetworkName}
                  value={network}
                  isSelected={network.label === selectedNetwork.label}
                />
              );
            })}
        </MenuSelect>
      </div>
      {networkStatus.isError && !networkStatus.isFetching && networkStatus.isFetched && (
        <div className={styles.connectionFailedBlock}>
          <span>{t('Failed to connect to network!')}</span>
          <span onClick={networkStatus.refetch}>{t('Try again')}</span>
        </div>
      )}
    </div>
  );
}

export default NetworkSwitcherDropdown;
