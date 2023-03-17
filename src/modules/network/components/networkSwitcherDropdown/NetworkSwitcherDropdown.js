/* eslint-disable max-statements */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MenuSelect, { MenuItem } from '@wallet/components/MenuSelect';
import Icon from 'src/theme/Icon';
import useSettings from '@settings/hooks/useSettings';
import { DEFAULT_NETWORK } from 'src/const/config';
import { useGetNetworksMainChainStatus } from '@blockchainApplication/manage/hooks/queries/useGetNetworksMainChainStatus';
import { useGetMergedApplication } from '@blockchainApplication/manage/hooks/useGetMergedApplication';
import styles from './NetworkSwitcherDropdown.css';
import networks from '../../configuration/networks';

function NetworkSwitcherDropdown({
  onSelectNetwork = () => {},
  onChangeMainChainData = () => {},
  onVerifyNetworkStatuses = () => {},
}) {
  const { t } = useTranslation();
  const { setValue, mainChainNetwork } = useSettings('mainChainNetwork');
  const {
    data: networksMainChainStatus,
    isLoading: isVerifyingNetworkOptions,
    isError: isErrorVerifyingNetworkOptions,
    isFetched: hasVerifiedNetworkOptions,
  } = useGetNetworksMainChainStatus();

  const selectedNetwork = mainChainNetwork || networks[DEFAULT_NETWORK];
  const selectedNetworkMainChain = networksMainChainStatus[selectedNetwork.name];

  const {
    data: application,
    isLoading: isGettingApplication,
    isError: isErrorGettingApplication,
    refetch: refetchApplicationData,
  } = useGetMergedApplication({
    params: { chainID: selectedNetworkMainChain?.data?.chainID },
    networkName: selectedNetwork.name,
    isEnabled: !!selectedNetworkMainChain,
  });

  const handleChangeNetwork = (value) => {
    setValue(value);
    onSelectNetwork(value);
  };

  useEffect(() => {
    onChangeMainChainData({ application, isErrorGettingApplication, isGettingApplication });
  }, [isGettingApplication, isErrorGettingApplication]);

  useEffect(() => {
    onVerifyNetworkStatuses({
      networksMainChainStatus,
      isVerifyingNetworkOptions,
      isErrorVerifyingNetworkOptions,
    });
  }, [isVerifyingNetworkOptions, isErrorVerifyingNetworkOptions]);

  useEffect(() => {
    refetchApplicationData();
  }, [mainChainNetwork]);

  useEffect(() => {
    if (!mainChainNetwork) setValue(networksMainChainStatus[DEFAULT_NETWORK]);
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
          isLoading={isVerifyingNetworkOptions || isGettingApplication}
          isValid={
            !isErrorVerifyingNetworkOptions &&
            hasVerifiedNetworkOptions &&
            !isErrorGettingApplication
          }
        >
          {Object.keys(networks)
            .filter((networkKey) => networksMainChainStatus[networkKey])
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
