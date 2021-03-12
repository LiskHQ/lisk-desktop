/* istanbul ignore file */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import networks from 'constants';
import { tokenMap } from 'constants';
import NetworkSelectorComp from './networkSelector';
import { networkSelected } from '../../../../actions/network';
import { settingsUpdated } from '../../../../actions/settings';

const NetworkSelector = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const selectedNetworkName = useSelector(state => state.network.name);
  const selectedNetwork = useSelector(
    state => state.network.networks[state.settings.token.active || tokenMap.LSK.key],
  );
  const selectedAddress = useSelector(
    state => ((state.network.networks[state.settings.token.active || tokenMap.LSK.key]
    && state.network.networks[state.settings.token.active || tokenMap.LSK.key].nodeUrl)
    || (state.settings.network && state.settings.network.name === networks.customNode.name && state.settings.network.address)) || '',
  );

  return (
    <NetworkSelectorComp
      t={t}
      selectedNetworkName={selectedNetworkName}
      selectedNetwork={selectedNetwork}
      selectedAddress={selectedAddress}
      networkSelected={params => dispatch(networkSelected(params))}
      settingsUpdated={params => dispatch(settingsUpdated(params))}
      {...props}
    />
  );
};

export default NetworkSelector;
