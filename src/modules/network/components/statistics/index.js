import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withData from 'src/utils/withData';
import { getNetworkStatistics } from '@network/utils/api';
import Statistics from './statistics';

export default compose(
  withData({
    networkStatistics: {
      apiUtil: network => getNetworkStatistics({ network }),
      defaultData: {},
      autoload: true,
      transformResponse: response => response.data,
    },
  }),
  withTranslation(),
)(Statistics);
