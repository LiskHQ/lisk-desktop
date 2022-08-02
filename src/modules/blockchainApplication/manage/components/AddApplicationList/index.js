/* istanbul ignore file */
import { compose } from 'redux';
import withData from 'src/utils/withData';
// TODO: This needs to be reinstated upon connection to latest service APIs
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import withFilters from 'src/utils/withFilters';
import { /* getApplications */ getFilteredOffChainApplications } from '../../../explore/api';
import AddApplicationList from './AddApplicationList';

const defaultUrlSearchParams = { isDefault: false, search: '' };

const apis = {
  liskApplications: {
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
  externalApplications: {
    apiUtil: (/* network, { token, chainId } */) => getFilteredOffChainApplications({
      data: mockBlockchainApplications,
    }),
    getApiParams: (state) => ({
      network: state.network,
    }),
    transformResponse: response => response.data,
    autoload: false,
  },
};

export default compose(
  withData(apis),
  withFilters('liskApplications', defaultUrlSearchParams),
)(AddApplicationList);
