/* istanbul ignore file */
import { compose } from 'redux';
import withData from 'src/utils/withData';
// TODO: This needs to be reinstated upon connection to latest service APIs
// import { getApplications } from '@blockchainApplication/api';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import withFilters from 'src/utils/withFilters';
import BlockchainApplicationAddList from './BlockchainApplicationAddList';

const defaultUrlSearchParams = { isDefault: false, search: '' };

const apis = {
  applications: {
    apiUtil: (/* network, { token, chainId } */) => new Promise((resolve) => resolve({
      data: mockBlockchainApplications,
    })),
    getApiParams: (state) => ({
      network: state.network,
    }),
    transformResponse: response => response.data,
    autoload: true,
    defaultData: mockBlockchainApplications,
  },
};

export default compose(
  withData(apis),
  withFilters('applications', defaultUrlSearchParams),
)(BlockchainApplicationAddList);
