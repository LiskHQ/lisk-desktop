/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getActiveTokenAccount } from '../../../utils/account';
import { getAccounts } from '../../../utils/api/account';
import { getTransaction } from '../../../utils/api/transaction';
import withData from '../../../utils/withData';
import TransactionDetails from './transactionDetails';
import { parseSearchParams } from '../../../utils/searchParams';

const mapStateToProps = (state, ownProps) => ({
  address: getActiveTokenAccount(state).address,
  id: ownProps.match.params.id,
  activeToken: state.settings.token ? state.settings.token.active : 'LSK',
  netCode: state.network.networks.LSK.code,
});

const apis = {
  transaction: {
    apiUtil: (network, { token, ...params }) => getTransaction({ network, params }, token),
    getApiParams: (state, ownProps) => ({
      token: state.settings.token.active,
      id: parseSearchParams(ownProps.location.search).transactionId,
      network: state.network,
    }),
    transformResponse: response => response.data[0] || {},
    autoload: true,
  },

  delegates: {
    apiUtil: getAccounts,
    autoload: false,
    defaultData: {},
    transformResponse: response => response.reduce((acc, item) => {
      acc[item.address] = item;
      return acc;
    }, {}),
  },
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData(apis),
)(TransactionDetails);
