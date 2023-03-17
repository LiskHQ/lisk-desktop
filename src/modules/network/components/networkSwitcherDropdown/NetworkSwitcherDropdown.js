/* eslint-disable max-statements */
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import MenuSelect, { MenuItem } from '@wallet/components/MenuSelect';
import Icon from 'src/theme/Icon';
import useSettings from '@settings/hooks/useSettings';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { DEFAULT_NETWORK } from 'src/const/config';
import { Client } from 'src/utils/api/client';
import styles from './NetworkSwitcherDropdown.css';
import networks from '../../configuration/networks';
import { useNetworkStatus } from '../../hooks/queries';

function NetworkSwitcherDropdown({
  onSelectNetwork = () => {},
  onLoadApplications = () => {},
  onLoadNetworkStatus = () => {},
}) {
  const { t } = useTranslation();
  const { setValue, mainChainNetwork } = useSettings('mainChainNetwork');

  const selectedNetwork = mainChainNetwork || networks[DEFAULT_NETWORK];

  const queryClient = useRef(new Client({ http: selectedNetwork.serviceUrl }));

  const {
    data: selectedNetworkStatus,
    isLoading: isGettingNetworkStatus,
    isError: isErrorGettingNetworkStatus,
    isFetched: hasFetchedNetworkStatus,
  } = useNetworkStatus({ client: queryClient.current });

  const {
    data,
    isLoading: isGettingApplication,
    isError: isErrorGettingApplication,
    refetch: refetchApplicationData,
  } = useBlockchainApplicationMeta({
    config: {
      params: {
        isDefault: true,
        network: selectedNetwork.name,
      },
    },
    options: { enabled: !!selectedNetworkStatus, keepPreviousData: false },
    client: new Client({ http: selectedNetwork.serviceUrl }),
  });

  const handleChangeNetwork = (value) => {
    setValue(value);
    onSelectNetwork(value);
  };

  useEffect(() => {
    onLoadApplications({
      isErrorGettingApplication,
      isGettingApplication,
      applications: data?.data,
    });
  }, [isGettingApplication, isErrorGettingApplication]);

  useEffect(() => {
    onLoadNetworkStatus({
      isGettingNetworkStatus,
      isErrorGettingNetworkStatus,
      selectedNetworkStatusData: selectedNetworkStatus?.data,
    });
  }, [isGettingNetworkStatus, isErrorGettingNetworkStatus]);

  useEffect(() => {
    refetchApplicationData();
  }, [mainChainNetwork]);

  useEffect(() => {
    if (!mainChainNetwork) setValue(networks[DEFAULT_NETWORK]);
  }, []);

  return (
    <>
      <div className={styles.networkSelectionWrapper}>
        <label>{t('Select network')}</label>
        <MenuSelect
          value={selectedNetwork}
          select={(selectedValue, option) => selectedValue.label === option.label}
          onChange={handleChangeNetwork}
          popupClassName={styles.networksPopup}
          className={styles.menuSelect}
          isLoading={isGettingNetworkStatus || isGettingApplication}
          isValid={
            !isErrorGettingNetworkStatus && hasFetchedNetworkStatus && !isErrorGettingApplication
          }
        >
          {Object.keys(networks)
            .filter((networkKey) => networks[networkKey].isAvailable)
            .map((networkKey) => {
              const network = networks[networkKey];

              return (
                <MenuItem
                  className={`${styles.networkItem} ${
                    selectedNetwork.label === network.label ? styles.selected : ''
                  }`}
                  value={network}
                  key={network.label}
                >
                  <span>{network.label}</span>
                  {selectedNetwork.label === network.label && <Icon name="okIcon" />}
                </MenuItem>
              );
            })}
        </MenuSelect>
      </div>
      {isErrorGettingApplication && !isGettingApplication && (
        <div>
          <span>
            {t('Failed to connect to network!  ')}
            <span onClick={refetchApplicationData}>{t('Try Again')}</span>
          </span>
        </div>
      )}
    </>
  );
}

export default NetworkSwitcherDropdown;
