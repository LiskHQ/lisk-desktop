/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
// TODO: this needs to be reinstated upon connection to latest service's apis
// import { getApplication } from '@blockchainApplication/explore/api';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import withData from 'src/utils/withData';
import { parseSearchParams } from 'src/utils/searchParams';
import BlockchainApplicationDetails from './BlockchainApplicationDetails';

const apis = {
  application: {
    apiUtil: (network, { chainId }) =>
      new Promise((resolve) =>
        resolve({
          data: mockBlockchainApplications.find((app) => app.chainID === chainId),
        })
      ),
    getApiParams: (state, ownProps) => ({
      chainId: parseSearchParams(ownProps.location.search).chainId,
      network: state.network,
    }),
    transformResponse: (response) => response.data,
    autoload: true,
    defaultData: mockBlockchainApplications[0],
  },
};

export default compose(withRouter, withData(apis))(BlockchainApplicationDetails);
