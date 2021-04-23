import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withData from '@utils/withData';
import { getTransactions } from '@api/transaction';
import { transformStringDateToUnixTimestamp } from '@utils/datetime';
import { toRawLsk } from '@utils/lsk';
import Transactions from './transactions';

const transformParams = params => Object.keys(params)
  .reduce((acc, item) => {
    switch (item) {
      case 'dateFrom':
        if (!acc.timestamp) acc.timestamp = ':';
        acc.timestamp = acc.timestamp.replace(/(\d+)?:/, `${transformStringDateToUnixTimestamp(params[item])}:`);
        break;
      case 'dateTo':
        if (!acc.timestamp) acc.timestamp = ':';
        acc.timestamp = acc.timestamp.replace(/:(\d+)?/, `:${transformStringDateToUnixTimestamp(params[item])}`);
        break;
      case 'amountFrom':
        if (!acc.amount) acc.amount = ':';
        acc.amount = acc.amount.replace(/(\d+)?:/, `${toRawLsk(params[item])}:`);
        break;
      case 'amountTo':
        if (!acc.amount) acc.amount = ':';
        acc.amount = acc.amount.replace(/:(\d+)?/, `:${toRawLsk(params[item])}`);
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
