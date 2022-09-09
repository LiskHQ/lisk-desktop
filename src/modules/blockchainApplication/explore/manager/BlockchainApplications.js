/* istanbul ignore file */
import { compose } from 'redux';
import withData from 'src/utils/withData';
// TODO: this needs to be reinstated upon connection to latest service's apis
// import { getStatistics } from '../../../explore/api';
// import { getApplications } from '@blockchainApplication/api';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import withFilters from 'src/utils/withFilters';
import ManageBlockchainApplicationsView from '../components/BlockchainApplications';

const defaultUrlSearchParams = { search: '' };

const getStatistics = () =>
  Promise.resolve({
    registered: 2503,
    active: 2328,
    terminated: 35,
    totalSupplyLSK: '5000000',
    stakedLSK: '3000000',
    inflationRate: '4.50',
  });

const apis = {
  statistics: {
    // apiUtil: (network, params) => getStatistics({ network, params }),
    apiUtil: () => getStatistics(),
    defaultData: {},
    autoload: true,
  },
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
