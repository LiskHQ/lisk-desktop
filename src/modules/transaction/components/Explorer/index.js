import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withFilters from '@common/utilities/withFilters';
import withData from '@common/utilities/withData';
import { getDelegates } from '@dpos/utilities/api';
import { getTransactions } from '@transaction/utils/api';
import { DEFAULT_LIMIT } from '@views/configuration';
import TransactionsList from './transactions';
import { normalizeTransactionParams } from '../../utils/transaction';

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
        token: state.settings.token.active,
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
      transformResponse: (response) => {
        const responseMap = response.data.reduce((acc, delegate) => {
          acc[delegate.address] = delegate;
          return acc;
        }, {});
        return responseMap;
      },
    },
  }),
  withFilters('transactions', defaultFilters, defaultSort),
  withTranslation(),
)(TransactionsList);
