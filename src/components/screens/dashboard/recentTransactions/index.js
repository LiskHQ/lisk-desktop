// istanbul ignore file
import { withTranslation } from 'react-i18next';
import { getTransactions } from '@api/transaction';
import withData from '@utils/withData';
import RecentTransaction from './recentTransactions';

export default withData({
  transactions: {
    apiUtil: (network, { token, ...params }) => getTransactions({ network, params }, token),
    getApiParams: (state) => {
      const token = state.settings.token.active;
      const address = state.account.info ? state.account.info[token].summary.address : '';
      return {
        token,
        address,
        network: state.network,
      };
    },
    defaultData: [],
    transformResponse: response => response.data.splice(0, 5),
  },
})(withTranslation()(RecentTransaction));
