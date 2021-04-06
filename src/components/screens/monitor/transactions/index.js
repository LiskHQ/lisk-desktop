import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withData from '@utils/withData';
import { getTransactions } from '@utils/api/transaction';
import { transformStringDateToUnixTimestamp } from '@utils/datetime';
import { toRawLsk } from '@utils/lsk';
import Transactions from './transactions';

// @TODO We can remove/update the following default values once https://github.com/LiskHQ/lisk-service/issues/435 is resolved
// From a random date in 2016 to a random date in 2025.
const defaultTimestampRange = '1483228800000:1735689600000';
// The maximum value possible.
const defaultAmountRange = '0:9223372036854775807';

const transformParams = params => Object.keys(params)
  .reduce((acc, item) => {
    switch (item) {
      case 'dateFrom':
        if (!acc.timestamp) acc.timestamp = defaultTimestampRange;
        acc.timestamp = acc.timestamp.replace(/\d+:/, `${transformStringDateToUnixTimestamp(params[item])}:`);
        break;
      case 'dateTo':
        if (!acc.timestamp) acc.timestamp = defaultTimestampRange;
        acc.timestamp = acc.timestamp.replace(/:\d+/, `:${transformStringDateToUnixTimestamp(params[item])}`);
        break;
      case 'amountFrom':
        if (!acc.amount) acc.amount = defaultAmountRange;
        acc.amount = acc.amount.replace(/\d+:/, `${toRawLsk(params[item])}:`);
        break;
      case 'amountTo':
        if (!acc.amount) acc.amount = defaultAmountRange;
        acc.amount = acc.amount.replace(/:\d+/, `:${toRawLsk(params[item])}`);
        break;
      default:
        acc[item] = params[item];
    }

    return acc;
  }, {});

export default compose(
  withData({
    transactions: {
      apiUtil: (network, { token, ...params }) =>
        getTransactions({ network, params: transformParams(params) }, token),
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
