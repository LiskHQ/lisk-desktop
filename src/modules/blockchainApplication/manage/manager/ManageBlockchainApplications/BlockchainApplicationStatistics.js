/* istanbul ignore file */
import { compose } from 'redux';
import withData from 'src/utils/withData';
import ManageBlockchainApplicationsView from '../../components/BlockchainApplications';
import { getStatistics } from '../../../explore/api';
import { getApplication } from '../../../api';

export default compose(
  withData({
    apps: {
      apiUtil: (network, params) => getApplication({ network, params }),
      defaultData: {},
      autoload: true,
    },
    statistics: {
      apiUtil: (network, params) => getStatistics({ network, params }),
      defaultData: {},
      autoload: true,
    },
  }),
)(ManageBlockchainApplicationsView);
