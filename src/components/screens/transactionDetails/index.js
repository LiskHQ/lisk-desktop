/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getActiveTokenAccount } from '../../../utils/account';
import liskService from '../../../utils/api/lsk/liskService';
import { getSingleTransaction } from '../../../utils/api/transactions';
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
    apiUtil: (apiClient, params) => getSingleTransaction(params),
    getApiParams: (state, ownProps) => ({
      token: state.settings.token.active,
      id: parseSearchParams(ownProps.location.search).transactionId,
      networkConfig: state.network,
    }),
    transformResponse: response => response.data[0] || {},
    autoload: true,
  },

  delegates: {
    apiUtil: liskService.getVoteNames,
    autoload: false,
    defaultData: {},
    getApiParams: (state, ownProps) => ({
      transactionId: ownProps.id,
    }),
  },
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData(apis),
)(TransactionDetails);
