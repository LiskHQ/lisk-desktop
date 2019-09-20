/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { getAccount } from '../../../utils/api/account';
import { getTransactions } from '../../../utils/api/transactions';
import ExplorerTransactions from './explorerTransactions';
import txFilters from '../../../constants/transactionFilters';
import withData from '../../../utils/withData';

const mapStateToProps = (state, ownProps) => ({
  account: state.account,
  address: ownProps.match.params.address,
  bookmarks: state.bookmarks,
  activeToken: state.settings.token ? state.settings.token.active : 'LSK',
  isDiscreetMode: state.settings.discreetMode || false,
});

// TODO the sort should be removed when BTC api returns transactions sorted by timestamp
const sortByTimestamp = (a, b) => (
  ((!a.timestamp && a.timestamp !== 0) || a.timestamp > b.timestamp) && b.timestamp ? -1 : 1
);

const apis = {
  detailAccount: {
    apiUtil: (liskAPIClient, params) => getAccount({ liskAPIClient, ...params }),
    autoload: true,
    getApiParams: (state, ownProps) => ({
      token: state.settings.token.active,
      address: ownProps.address,
      networkConfig: state.network,
    }),
  },
  transactions: {
    apiUtil: (apiClient, params) => getTransactions(params),
    getApiParams: (state, ownProps) => ({
      token: state.settings.token.active,
      address: ownProps.address,
      networkConfig: state.network,
    }),
    defaultData: {
      data: [],
      meta: {},
    },
    defaultUrlSearchParams: {
      filters: {
        direction: txFilters.all,
      },
    },
    transformResponse: (response, oldData) => (
      response.meta.offset > 0 ? {
        ...oldData,
        data: [
          ...oldData.data, ...response.data,
        ].sort(sortByTimestamp),
      } : {
        ...response,
        data: response.data.sort(sortByTimestamp),
      }
    ),
  },
};

export default withRouter(connect(
  mapStateToProps,
)(withData(apis)(withTranslation()(ExplorerTransactions))));
