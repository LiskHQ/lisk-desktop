import { compose } from 'redux';
import withData from 'src/utils/withData';
import ManageBlockchainApplicationsView from '../../components/ManageBlockchainApplications';
import { getApps, getStatistics } from '../../../utils/api';

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
