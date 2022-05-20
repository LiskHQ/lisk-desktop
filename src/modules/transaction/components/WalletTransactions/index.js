import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withFilters from 'src/utils/withFilters';
import withData from 'src/utils/withData';
import { getDelegates } from '@dpos/validator/api';
import { DEFAULT_LIMIT } from 'src/utils/monitor';
import { selectActiveToken } from '@common/store';
import TransactionsList from './TransactionList';
import { normalizeTransactionParams } from '../../utils';
import { getTransactions } from '../../api';

const defaultFilters = {
  dateFrom: '',
  dateTo: '',
  amountFrom: '',
  amountTo: '',
};
const defaultSort = 'timestamp:desc';

export default compose(
  withData({
    transactions: {
      apiUtil: (network, { token, ...params }) =>
        getTransactions({ network, params: normalizeTransactionParams(params) }, token),
      getApiParams: (state, { address, sort }) => ({
        token: selectActiveToken(state),
        address,
        sort,
        limit: DEFAULT_LIMIT,
      }),
      defaultData: { data: [], meta: {} },
      autoload: true,
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? { data: [...oldData.data, ...response.data], meta: response.meta }
          : response
      ),
    },
    votedDelegates: {
      apiUtil: ({ networks }, params) => getDelegates({ network: networks.LSK, params }),
      defaultData: [],
      transformResponse: (response) => response.data.reduce((acc, delegate) => {
        acc[delegate.address] = delegate;
        return acc;
      }, {}),
    },
  }),
  withFilters('transactions', defaultFilters, defaultSort),
  withTranslation(),
)(TransactionsList);
