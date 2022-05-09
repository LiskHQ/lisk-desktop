/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withFilters from 'src/utils/withFilters';
import withData from 'src/utils/withData';
import { getTransactions } from '@transaction/api';
import { DEFAULT_LIMIT } from 'src/utils/monitor';
import { normalizeTransactionParams } from '../../utils';
import TransactionMonitorist from './TransactionMonitorList';

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
)(TransactionMonitorist);
