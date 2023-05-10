/* eslint-disable complexity, max-statements */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MenuSelect, { MenuItem } from '@wallet/components/MenuSelect';
import Icon from 'src/theme/Icon';
import useSettings from '@settings/hooks/useSettings';
import { Client } from 'src/utils/api/client';
import DialogLink from '@theme/dialog/link';
import { selectStaking } from 'src/redux/selectors';
import { stakesReset } from 'src/redux/actions';
import {
  removeThenAppendSearchParamsToUrl,
  removeSearchParamsFromUrl,
} from 'src/utils/searchParams';
import { createConfirmSwitchState } from '@common/utils/createConfirmSwitchState';
import stylesSecondaryButton from '@theme/buttons/css/secondaryButton.css';
import classNames from 'classnames';
import networks from '../../configuration/networks';
import { useNetworkStatus } from '../../hooks/queries';
import styles from './NetworkSwitcherDropdown.css';

function NetworkSwitcherDropdown({ noLabel, onNetworkSwitchSuccess, history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setValue, mainChainNetwork } = useSettings('mainChainNetwork');
  const [selectedNetwork, setSelectedNetwork] = useState(mainChainNetwork);
  const { customNetworks } = useSettings('customNetworks');
  const networksWithCustomNetworks = [...Object.values(networks), ...customNetworks];
  const stakingQueue = useSelector(selectStaking);
  const pendingStakes = Object.values(stakingQueue).filter(
    (stake) => stake.confirmed !== stake.unconfirmed
  );

  const queryClient = useRef(new Client({ http: selectedNetwork.serviceUrl }));

  const networkStatus = useNetworkStatus({
    options: {
      retry: false,
    },
    client: queryClient.current,
  });

  const handleChangeNetwork = useCallback(
    (network) => {
      queryClient.current.create({
        http: network.serviceUrl,
      });
      networkStatus.refetch().then((res) => {
        if (!res.error) {
          // clear stakes list during network switch
          if (pendingStakes.length) {
            const onCancel = /* istanbul ignore next */ () =>
              removeSearchParamsFromUrl(history, ['modal']);
            const onConfirm = /* istanbul ignore next */ () => {
              setValue(network);
              setSelectedNetwork(network);

              dispatch(stakesReset());
              removeSearchParamsFromUrl(history, ['modal']);
            };
            const state = createConfirmSwitchState({
              mode: 'pendingStakes',
              type: 'network',
              onCancel,
              onConfirm,
            });
            removeThenAppendSearchParamsToUrl(
              history,
              { modal: 'confirmationDialog' },
              ['modal'],
              state
            );
          } else {
            setValue(network);
            setSelectedNetwork(network);
          }
        }
      });
    },
    [networkStatus]
  );

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
          select={(selectedValue, option) => selectedValue.label === option.label}
          onChange={handleChangeNetwork}
          popupClassName={styles.networksPopup}
          className={styles.menuSelect}
          isLoading={networkStatus.isLoading}
          isValid={!networkStatus.isError && networkStatus.isFetched}
        >
          {Object.keys(networksWithCustomNetworks)
            .filter((networkKey) => networksWithCustomNetworks[networkKey].isAvailable)
            .map((networkKey) => {
              const network = networksWithCustomNetworks[networkKey];

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
      {networkStatus.isError && networkStatus.isFetched && (
        <div className={styles.connectionFailedBlock}>
          <span>{t('Failed to connect to network!')}</span>
          <span onClick={networkStatus.refetch}>{t('Try again')}</span>
        </div>
      )}
      <DialogLink
        className={classNames(styles.addNetworkBtn, stylesSecondaryButton.button)}
        component="dialogAddNetwork"
      >
        <Icon name="plusBlueIcon" />
        <span>{t('Add network')}</span>
      </DialogLink>
    </div>
  );
}

export default withRouter(NetworkSwitcherDropdown);
