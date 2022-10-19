/* istanbul ignore file */
import { compose } from 'redux';
import withData from 'src/utils/withData';
// TODO: this needs to be reinstated upon connection to latest service's apis
// import { getApplications } from '@blockchainApplication/api';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import withFilters from 'src/utils/withFilters';
import ManageBlockchainApplicationsView from '../components/BlockchainApplications';

const defaultUrlSearchParams = { search: '' };

const apis = {
  applications: {
    apiUtil: (/* network, { token, chainId } */) =>
      new Promise((resolve) =>
        resolve({
          data: mockBlockchainApplications,
        })
      ),
    getApiParams: (state) => ({
      network: state.network,
    }),
    transformResponse: (response) => response.data,
    autoload: true,
    defaultData: mockBlockchainApplications,
  },
};

export default compose(
  withData(apis),
  withFilters('applications', defaultUrlSearchParams)
)(ManageBlockchainApplicationsView);
