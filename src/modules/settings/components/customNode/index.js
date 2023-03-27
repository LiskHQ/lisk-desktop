/* istanbul ignore file */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { networkSelected, customNetworkRemoved, customNetworkStored } from 'src/redux/actions';
import { selectSettings } from 'src/redux/selectors';
import CustomNode from './customNode';

const CustomNodeHOC = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const settings = useSelector(selectSettings);

  return (
    <CustomNode
      t={t}
      settings={settings}
      networkSelected={(params) => dispatch(networkSelected(params))}
      customNetworkRemoved={() => dispatch(customNetworkRemoved())}
      customNetworkStored={(params) => dispatch(customNetworkStored(params))}
      {...props}
    />
  );
};

export default React.memo(CustomNodeHOC);
