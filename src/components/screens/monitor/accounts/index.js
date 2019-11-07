/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withData from '../../../../utils/withData';
import MonitorAccounts from './accounts';
import liskServiceApi from '../../../../utils/api/lsk/liskService';

export default compose(
  withData(
    {
      accounts: {
        apiUtil: liskServiceApi.getTopAccounts,
        defaultData: [],
        autoload: true,
        transformResponse: (response, accounts, urlSearchParams) => (
          urlSearchParams.offset
            ? [...accounts, ...response.data]
            : response.data
        ),
      },
      networkStatus: {
        apiUtil: liskServiceApi.getNetworkStatus,
        defaultData: {},
        autoload: true,
        transformResponse: response => response,
      },
    },
  ),
  withTranslation(),
)(MonitorAccounts);
