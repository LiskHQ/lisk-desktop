/* istanbul ignore file */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  networkSelected, customNetworkRemoved, customNetworkStored,
} from '@actions';
import CustomNode from './customNode';

const CustomNodeHOC = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const settings = useSelector(state => state.settings);

  return (
    <CustomNode
      t={t}
      settings={settings}
      networkSelected={params => dispatch(networkSelected(params))}
      customNetworkRemoved={params => dispatch(customNetworkRemoved(params))}
      customNetworkStored={params => dispatch(customNetworkStored(params))}
      {...props}
    />
  );
};

export default React.memo(CustomNodeHOC);
