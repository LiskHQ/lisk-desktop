import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withFilters from 'src/utils/withFilters';
import withData from 'src/utils/withData';
import { getValidators } from '@pos/validator/api';
import TransactionsList from './TransactionList';

const defaultFilters = {
  dateFrom: '',
  dateTo: '',
  amountFrom: '',
  amountTo: '',
};
const defaultSort = 'timestamp:desc';

export default compose(
  withData({
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
