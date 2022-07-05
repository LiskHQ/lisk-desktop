/* istanbul ignore file */
import { compose } from 'redux';
import withData from 'src/utils/withData';
import ManageBlockchainApplicationsView from '../../components/ManageBlockchainApplications';
// import { getApps, getStatistics } from '../../../explore/utils/api';

const getStatistics = () => Promise.resolve({
  registered: 2503,
  active: 2328,
  terminated: 35,
  totalSupplyLSK: '5000000',
  stakedLSK: '3000000',
  inflationRate: '4.50',
});

export default compose(
  withData({
    statistics: {
      // apiUtil: (network, params) => getStatistics({ network, params }),
      apiUtil: () => getStatistics(),
      defaultData: {},
      autoload: true,
    },
  }),
)(ManageBlockchainApplicationsView);
