import { compose } from 'redux';
import withData from 'src/utils/withData';
import ManageBlockchainApplicationsView from '../../components/ManageBlockchainApplications';
import { getApps, getStatistics } from '../../../utils/api';

export default compose(
  withData({
    apps: {
      // apiUtil: (network, params) => getApps({ network, params }),
      apiUtil: () => getApps(),
      defaultData: [],
      autoload: true,
    },
    statistics: {
      // apiUtil: (network, params) => getStatistics({ network, params }),
      apiUtil: () => getStatistics(),
      defaultData: {},
      autoload: true,
    },
  }),
)(ManageBlockchainApplicationsView);
