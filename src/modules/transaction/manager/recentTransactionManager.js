// istanbul ignore file
import { withTranslation } from 'react-i18next';
import withData from '@common/utilities/withData';
import RecentTransaction from '../components/RecentTransactions/RecentTransactions';
import { getTransactions } from '../api';

export default withData({
  transactions: {
    apiUtil: (network, { token, ...params }) => getTransactions({ network, params }, token),
    getApiParams: (state) => {
      const token = state.settings.token.active;
      const address = state.wallet.info ? state.wallet.info[token].summary.address : '';
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
