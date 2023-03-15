/* eslint-disable max-statements */
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import MenuSelect, { MenuItem } from '@wallet/components/MenuSelect';
import {
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { PrimaryButton } from 'src/theme/buttons';
import { BLOCKCHAIN_APPS, BLOCKCHAIN_APPS_META } from 'src/const/queries';
import Icon from 'src/theme/Icon';
import routes from 'src/routes/routes';
import useSettings from '@settings/hooks/useSettings';
import { DEFAULT_NETWORK } from 'src/const/config';
import { useGetNetworksMainChainStatus } from '@blockchainApplication/manage/hooks/queries/useGetNetworksMainChainStatus';
import { useGetMergedApplication } from '@blockchainApplication/manage/hooks/useGetMergedApplication';
import styles from './SelectNetwork.css';
import networks from '../../configuration/networks';

function ManageAccounts({ history }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { setValue, mainChainNetwork } = useSettings('mainChainNetwork');

  const { setApplications } = useApplicationManagement();
  const [, setCurrentApplication] = useCurrentApplication();
  const {
    data: networksMainChainStatus,
    isLoading: isVerifyingNetworkOptions,
    isError: isErrorVerifyingNetworkOptions,
    isFetched: hasVerifiedNetworkOptions,
  } = useGetNetworksMainChainStatus();

  const selectedNetwork = mainChainNetwork || networks[DEFAULT_NETWORK];
  const selectedNetworkMainChain = networksMainChainStatus[selectedNetwork.name];

  const {
    data: mainChainApplication,
    isLoading: isGettingMainChain,
    isError: isErrorGettingMainChain,
    refetch: refetchMergedApplicationData,
  } = useGetMergedApplication({
    params: { chainID: selectedNetworkMainChain?.data?.chainID },
    networkName: selectedNetwork.name,
    isEnabled: !!selectedNetworkMainChain,
  });

  const goToDashboard = useCallback(() => {
    setApplications([mainChainApplication]);
    setCurrentApplication(mainChainApplication);

    history.push(routes.dashboard.path);
  }, [mainChainApplication]);

  const invalidateBlockchainAppsQuery = async () =>
    queryClient.invalidateQueries({
      queryKey: [BLOCKCHAIN_APPS_META, BLOCKCHAIN_APPS],
    });

  const retry = async () => {
    await invalidateBlockchainAppsQuery();
    refetchMergedApplicationData();
  };

  const handleChangeNetwork = async (value) => {
    await invalidateBlockchainAppsQuery();
    setValue(value);
  };

  useEffect(() => {
    refetchMergedApplicationData();
  }, [mainChainNetwork]);

  useEffect(() => {
    if (!selectedNetwork) setValue(networksMainChainStatus[DEFAULT_NETWORK]);
  }, []);

  return (
    <div className={`${styles.selectNetworkWrapper} ${grid.row}`}>
      <div
        className={`${styles.selectNetwork} ${grid['col-xs-12']} ${grid['col-md-8']} ${grid['col-lg-6']}`}
      >
        <div className={styles.wrapper}>
          <div className={styles.headerWrapper}>
            <h1 data-testid="manage-title">{t('Switch Network')}</h1>
          </div>
          <div className={styles.contentWrapper}>
            <p className={styles.subHeader}>
              {t(
                '"Lisk" will be the default mainchain application, please select your preferred network for accessing the wallet. Once selected please click on "Continue to dashboard".'
              )}
            </p>
            <div>
              <Icon name="liskLogoWhiteNormalized" />
            </div>
            <h6>Lisk</h6>
          </div>
          <div className={styles.networkSelectionWrapper}>
            <label>Select network</label>
            <MenuSelect
              value={selectedNetwork}
              select={(selectedValue, option) => selectedValue.label === option.label}
              onChange={handleChangeNetwork}
              popupClassName={styles.networksPopup}
              className={styles.menuSelect}
              isLoading={isVerifyingNetworkOptions || isGettingMainChain}
              isValid={
                !isErrorVerifyingNetworkOptions &&
                hasVerifiedNetworkOptions &&
                !isErrorGettingMainChain
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
          {isErrorGettingMainChain && !isGettingMainChain && (
            <div>
              <span>
                Failed to connect to network! &nbsp;
                <span onClick={retry}>Try Again</span>
              </span>
            </div>
          )}
          <PrimaryButton
            className={`${styles.button} ${styles.continueBtn}`}
            onClick={goToDashboard}
            disabled={
              isVerifyingNetworkOptions || isErrorVerifyingNetworkOptions || isErrorGettingMainChain
            }
          >
            {t('Continue to dashbord')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

ManageAccounts.defaultProps = {
  isRemoveAvailable: true,
  isDialog: false,
};

export default withRouter(ManageAccounts);
