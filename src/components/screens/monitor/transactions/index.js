import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import Transactions from './transactions';
import withData from '../../../../utils/withData';
import { getTransactions } from '../../../../utils/api/transaction';

export default compose(
  withData({
    transactions: {
      apiUtil: (network, { token, ...params }) =>
        getTransactions({ network, params }, token),
      getApiParams: state => ({
        token: state.settings.token.active,
      }),
      defaultData: [],
      autoload: true,
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? [...oldData, ...response.data.filter(block =>
            !oldData.find(({ id }) => id === block.id))]
          : response.data
      ),
    },
  }),
  withTranslation(),
)(Transactions);
