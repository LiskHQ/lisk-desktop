// istanbul ignore file
import { withTranslation } from 'react-i18next';
import withData from 'src/utils/withData';
import { selectActiveToken, selectActiveTokenAccount } from '@common/store';
import RecentTransaction from '../components/RecentTransactions/RecentTransactions';
import { getTransactions } from '../api';

export default withData({
  transactions: {
    apiUtil: (network, { token, ...params }) => getTransactions({ network, params }, token),
    getApiParams: (state) => {
      const token = selectActiveToken(state);
      const wallet = selectActiveTokenAccount(state);
      const address = wallet.summary.address;
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
