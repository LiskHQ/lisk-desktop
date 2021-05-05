/* istanbul ignore file */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { tokenMap } from '@constants';
import { networkSelected, settingsUpdated } from '@actions';
import NetworkSelectorComp from './networkSelector';

const NetworkSelector = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const network = useSelector(state => state.network);
  const settings = useSelector(state => state.settings);
  const selectedNetworkName = network.name || settings.network.name;
  const networkConfig = network.networks[settings.token.active || tokenMap.LSK.key];
  const selectedAddress = networkConfig?.serviceUrl || settings.network?.address;

  return (
    <NetworkSelectorComp
      t={t}
      selectedNetworkName={selectedNetworkName}
      selectedNetwork={networkConfig}
      selectedAddress={selectedNetworkName === 'customNode' ? selectedAddress : ''}
      networkSelected={params => dispatch(networkSelected(params))}
      settingsUpdated={params => dispatch(settingsUpdated(params))}
      {...props}
    />
  );
};

export default NetworkSelector;
