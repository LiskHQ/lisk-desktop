import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withFilters from 'src/utils/withFilters';
import withData from 'src/utils/withData';
import { getValidators } from '@pos/validator/api';
import { DEFAULT_LIMIT } from 'src/utils/monitor';
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
        getTransactions({ network, params: normalizeTransactionParams(params) }),
      getApiParams: (_, { address, sort }) => ({
        address,
        sort,
        limit: DEFAULT_LIMIT,
      }),
      defaultData: { data: [], meta: {} },
      autoload: true,
      transformResponse: (response, oldData, urlSearchParams) =>
        urlSearchParams.offset
          ? { data: [...oldData.data, ...response.data], meta: response.meta }
          : response,
    },
    stakedValidators: {
      apiUtil: ({ networks }, params) => getValidators({ network: networks.LSK, params }),
      defaultData: [],
      transformResponse: (response) =>
        response.data.reduce((acc, validator) => {
          acc[validator.address] = validator;
          return acc;
        }, {}),
    },
  }),
  withFilters('transactions', defaultFilters, defaultSort),
  withTranslation()
)(TransactionsList);
