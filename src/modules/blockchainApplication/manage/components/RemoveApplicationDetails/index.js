/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import withData from 'src/utils/withData';
import { parseSearchParams } from 'src/utils/searchParams';
import RemoveApplicationDetails from './RemoveApplicationDetails';

const apis = {
  application: {
    apiUtil: (network, { chainId }) =>
      new Promise((resolve) =>
        resolve({
          data: mockManagedApplications.find((app) => app.chainID === chainId),
        })
      ),
    getApiParams: (state, ownProps) => ({
      chainId: parseSearchParams(ownProps.location.search).chainId,
      network: state.network,
    }),
    transformResponse: (response) => response.data,
    autoload: true,
    defaultData: mockManagedApplications[0],
  },
};

export default compose(withRouter, withData(apis))(RemoveApplicationDetails);
