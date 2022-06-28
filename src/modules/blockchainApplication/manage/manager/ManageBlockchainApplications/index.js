import { compose } from 'redux';
import withData from 'src/utils/withData';
import ManageBlockchainApplicationsView from '../../components/ManageBlockchainApplications';

// TODO implement this method in api
const getApps = () => Promise.resolve([
  { status: 'registered' }, { status: 'registered' }, { status: 'active' }, { status: 'terminated' },
]);

const getStatistics = () => Promise.resolve({
  totalSupplyLSK: 5e13,
  stakedLSK: 3e13,
});

export default compose(
  withData({
    apps: {
      apiUtil: (network, params) => getApps({ network, params }),
      defaultData: [],
      autoload: true,
    },
    statistics: {
      apiUtil: (network, params) => getStatistics({ network, params }),
      defaultData: {},
      autoload: true,
    },
  }),
)(ManageBlockchainApplicationsView);
