/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withFilters from '@common/utilities/withFilters';
import withData from '@common/utilities/withData';
import { getTransactions } from '@transaction/api';
import { DEFAULT_LIMIT } from '@views/configuration';
import { normalizeTransactionParams } from '../../utils/transaction';
import Transactions from './TransactionMonitorList';

const defaultFilters = {
  dateFrom: '',
  dateTo: '',
  amountFrom: '',
  amountTo: '',
  moduleAssetId: '',
  height: '',
  recipientAddress: '',
  senderAddress: '',
};
const defaultSort = 'timestamp:desc';

export default compose(
  withData({
    transactions: {
      apiUtil: (network, { token, ...params }) =>
        getTransactions({ network, params: normalizeTransactionParams(params) }, token),
      getApiParams: state => ({
        token: state.token.active,
        limit: DEFAULT_LIMIT,
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
  withFilters('transactions', defaultFilters, defaultSort),
  withTranslation(),
)(Transactions);
