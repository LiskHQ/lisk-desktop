// istanbul ignore file
import { withTranslation } from 'react-i18next';
import { getTransactions } from '../../../../utils/api/transactions';
import { isEmpty } from '../../../../utils/helpers';
import withData from '../../../../utils/withData';
import RecentTransaction from './recentTransactions';

export default withData({
  transactions: {
    apiUtil: (liskAPIClient, params) => getTransactions(params),
    getApiParams: (state) => {
      const token = state.settings.token.active;
      const address = !isEmpty(state.account) ? state.account.info[token].address : '';
      return {
        token,
        address,
        networkConfig: state.network,
      };
    },
    defaultData: [],
    transformResponse: response => response.data.splice(0, 5),
  },
})(withTranslation()(RecentTransaction));
