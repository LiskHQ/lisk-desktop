/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Network from './network';
import withLocalSort from '../../../../utils/withLocalSort';
import liskService from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';
import NotAvailable from '../notAvailable';

const ComposedNetwork = compose(
  withData({
    peers: {
      apiUtil: liskService.getConnectedPeers,
      defaultData: [],
      autoload: true,
      transformResponse: response => response.data,
    },
  }),
  withLocalSort('peers', 'height:asc'),
  withTranslation(),
)(Network);

const NetworkMonitor = () => {
  const network = useSelector(state => state.network);

  return (
    liskService.getLiskServiceUrl(network) === null
      ? <NotAvailable />
      : <ComposedNetwork />
  );
};

export default NetworkMonitor;
