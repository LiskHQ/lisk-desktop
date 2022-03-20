/* istanbul ignore file */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { networkSelected } from '@actions';
import NetworkSelectorComp from './networkSelector';

const NetworkSelector = (props) => {
  const dispatch = useDispatch();
  const network = useSelector(state => state.network);
  const settings = useSelector(state => state.settings);

  return (
    <NetworkSelectorComp
      network={network}
      settings={settings}
      networkSelected={params => dispatch(networkSelected(params))}
      {...props}
    />
  );
};

export default React.memo(NetworkSelector);
