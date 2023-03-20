/* eslint-disable max-statements */
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuSelect, { MenuItem } from '@wallet/components/MenuSelect';
import Icon from 'src/theme/Icon';
import useSettings from '@settings/hooks/useSettings';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import {
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import { DEFAULT_NETWORK } from 'src/const/config';
import { Client } from 'src/utils/api/client';
import styles from './NetworkSwitcherDropdown.css';
import networks from '../../configuration/networks';
import { useNetworkStatus } from '../../hooks/queries';

function NetworkSwitcherDropdown({
  noLabel,
  onLoadApplications = () => {},
  onLoadNetworkStatus = () => {},
}) {
  const { t } = useTranslation();
  const { setValue } = useSettings('mainChainNetwork');
  const [selectedNetwork, setSelectedNetwork] = useState(networks[DEFAULT_NETWORK]);
  const { setApplications } = useApplicationManagement();
  const [, setCurrentApplication] = useCurrentApplication();
  const queryClient = useRef(new Client({ http: selectedNetwork.serviceUrl }));

  const {
    data: selectedNetworkStatus,
    isLoading: isGettingNetworkStatus,
    isError: isErrorGettingNetworkStatus,
    isFetched: hasFetchedNetworkStatus,
    refetch: refetchNetworkStatus,
  } = useNetworkStatus({ client: queryClient.current });

  const {
    data,
    isLoading: isGettingApplication,
    isError: isErrorGettingApplication,
    isFetched: hasFetchedApplication,
    refetch: refetchApplicationData,
  } = useBlockchainApplicationMeta({
    config: {
      params: {
        isDefault: true,
        network: selectedNetwork.name,
      },
    },
    options: {
      enabled: !!selectedNetworkStatus && !isGettingNetworkStatus && !isErrorGettingNetworkStatus,
    },
    client: new Client({ http: selectedNetwork.serviceUrl }),
  });

  const defaultApplications = data?.data || [];

  const handleChangeNetwork = (network) => {
    queryClient.current.create({
      http: network.serviceUrl,
    });
    refetchNetworkStatus();
    setSelectedNetwork(network);
  };

  useEffect(() => {
    if (defaultApplications && !isGettingApplication && !isErrorGettingApplication) {
      setValue(selectedNetwork);

      const mainChain = defaultApplications.find(
        ({ chainID }) => chainID === selectedNetworkStatus?.chainID
      );
      if (mainChain) setCurrentApplication(mainChain);
      setApplications(defaultApplications);
    }

    onLoadApplications({
      isErrorGettingApplication,
      isGettingApplication,
      applications: defaultApplications,
    });
  }, [isGettingApplication, isErrorGettingApplication, hasFetchedApplication]);

  useEffect(() => {
    onLoadNetworkStatus({
      isGettingNetworkStatus,
      isErrorGettingNetworkStatus,
      selectedNetworkStatusData: selectedNetworkStatus?.data,
    });
  }, [isGettingNetworkStatus, isErrorGettingNetworkStatus]);

  useEffect(() => {
    refetchApplicationData();
  }, [selectedNetwork]);

  return (
    <>
      <div className={styles.networkSelectionWrapper}>
        {!noLabel && <label>{t('Select network')}</label>}
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
