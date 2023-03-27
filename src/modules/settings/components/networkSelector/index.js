/* istanbul ignore file */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { networkSelected } from 'src/redux/actions';
import { selectSettings } from 'src/redux/selectors';
import NetworkSelectorComp from './networkSelector';

const NetworkSelector = (props) => {
  const dispatch = useDispatch();
  const network = useSelector((state) => state.network);
  const settings = useSelector(selectSettings);

  return (
    <NetworkSelectorComp
      network={network}
      settings={settings}
      networkSelected={(params) => dispatch(networkSelected(params))}
      {...props}
    />
  );
};

export default React.memo(NetworkSelector);
