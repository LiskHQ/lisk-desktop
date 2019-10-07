/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withData from '../../../../utils/withData';
import Transactions from './transactions';
import { getTransactions } from '../../../../utils/api/lsk/transactions';

export default compose(
  withData({
    transactions: {
      apiUtil: (liskAPIClient, params) => getTransactions({ liskAPIClient, ...params }),
      defaultData: [],
      autoload: true,
      transformResponse: (response, oldData) => [
        ...oldData,
        ...response.data.filter(transaction => !oldData.find(({ id }) => id === transaction.id)),
      ],
    },
  }),
  withTranslation(),
)(Transactions);
