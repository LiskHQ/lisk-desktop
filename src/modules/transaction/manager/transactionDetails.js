/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getActiveTokenAccount } from '@wallet/utilities/account';
import withData from '@common/utilities/withData';
import { parseSearchParams } from '@screens/router/searchParams';
import TransactionDetailsManager from '../components/TransactionDetailsManger';
import { getTransaction } from '../api';

const mapStateToProps = (state, ownProps) => ({
  account: getActiveTokenAccount(state),
  id: ownProps.match.params.id,
  activeToken: state.settings.token?.active ?? 'LSK',
});

const apis = {
  transaction: {
    apiUtil: (network, { token, transactionId }) =>
      getTransaction({ network, params: { transactionId } }, token),
    getApiParams: (state, ownProps) => ({
      token: state.settings.token.active,
      transactionId: parseSearchParams(ownProps.location.search).transactionId,
      network: state.network,
    }),
    transformResponse: response => response.data[0] || {},
    autoload: true,
  },
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData(apis),
)(TransactionDetailsManager);
