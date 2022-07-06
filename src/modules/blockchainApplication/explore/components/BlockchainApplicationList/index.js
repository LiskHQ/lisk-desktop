/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
// import { getApplications } from '@blockchainApplication/api';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplications';
import withData from 'src/utils/withData';
import withFilters from 'src/utils/withFilters';
import BlockchainApplicationList from './BlockchainApplicationList';

const defaultUrlSearchParams = { search: '' };

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
  withRouter,
  withData(apis),
  withFilters('applications', defaultUrlSearchParams),
)(BlockchainApplicationList);
