/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import BlockDetails from './blockDetails';
import liskService from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';
import withResizeValues from '../../../../utils/withResizeValues';
import NotAvailable from '../notAvailable';

const mapStateToProps = (state, ownProps) => ({
  id: ownProps.match.params.id,
});
const ComposedBlockDetails = compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    blockDetails: {
      apiUtil: liskService.getBlockDetails,
      autoload: true,
      getApiParams: (state, ownProps) => ({ id: ownProps.id }),
      transformResponse: response => (response.data && response.data[0]),
    },
    blockTransactions: {
      apiUtil: liskService.getBlockTransactions,
      defaultData: [],
      autoload: true,
      getApiParams: (state, ownProps) => ({ id: ownProps.id }),
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? [...oldData, ...response.data.filter(block =>
            !oldData.find(({ id }) => id === block.id))]
          : response.data
      ),
    },
  }),
  withTranslation(),
  withResizeValues,
)(BlockDetails);

const BlockDetailsMonitor = () => {
  const network = useSelector(state => state.network);

  return (
    liskService.getLiskServiceUrl(network) === null
      ? <NotAvailable />
      : <ComposedBlockDetails />
  );
};

export default BlockDetailsMonitor;
