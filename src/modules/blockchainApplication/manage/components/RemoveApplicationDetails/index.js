/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { getApplication } from '@blockchainApplication/explore/api';
import withData from 'src/utils/withData';
import { parseSearchParams } from 'src/utils/searchParams';
import RemoveApplicationDetails from './RemoveApplicationDetails';

const apis = {
  application: {
    apiUtil: (network, { token, chainId }) =>
      getApplication({ network, params: { chainId } }, token),
    getApiParams: (state, ownProps) => ({
      chainId: parseSearchParams(ownProps.location.search).chainId,
      network: state.network,
    }),
    transformResponse: response => response.data[0] || {},
    autoload: true,
  },
};

export default compose(
  withRouter,
  withData(apis),
)(RemoveApplicationDetails);
