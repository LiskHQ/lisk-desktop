/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getActiveTokenAccount } from '../../utils/account';
import { getDelegates } from '../../utils/api/delegates';
import { getSingleTransaction } from '../../utils/api/transactions';
import SingleTransaction from './singleTransaction';
import withData from '../../utils/withData';

const mapStateToProps = (state, ownProps) => ({
  address: getActiveTokenAccount(state).address,
  id: ownProps.match.params.id,
  activeToken: state.settings.token ? state.settings.token.active : 'LSK',
});

const apis = {
  transaction: {
    apiUtil: (apiClient, params) => getSingleTransaction(params),
    getApiParams: (state, ownProps) => ({
      token: state.settings.token.active,
      id: ownProps.id,
      networkConfig: state.network,
    }),
    transformResponse: response => response.data[0] || {},
    autoload: true,
  },
  delegates: {
    apiUtil: getDelegates,
    defaultData: {},
    transformResponse: (response, oldData) => ({
      ...oldData,
      ...response.data.reduce((acc, item) => ({ ...acc, [item.account.publicKey]: item }), {}),
    }),
  },
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData(apis),
)(SingleTransaction);
