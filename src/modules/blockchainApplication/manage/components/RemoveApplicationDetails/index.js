/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
// import { getApplication } from '@blockchainApplication/explore/api';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import withData from 'src/utils/withData';
import { parseSearchParams } from 'src/utils/searchParams';
import RemoveApplicationDetails from './RemoveApplicationDetails';

const apis = {
  application: {
    apiUtil: (/* network, { token, chainId } */) => new Promise((resolve) => resolve({
      data: mockBlockchainApplications[0],
    })),
    getApiParams: (state, ownProps) => ({
      chainId: parseSearchParams(ownProps.location?.search)?.chainId,
      network: state.network,
    }),
    transformResponse: response => response.data,
    autoload: true,
    defaultData: mockBlockchainApplications[0],
  },
};

export default compose(
  withRouter,
  withData(apis),
)(RemoveApplicationDetails);
