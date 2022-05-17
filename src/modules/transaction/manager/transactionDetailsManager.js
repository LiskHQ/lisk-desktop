/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getActiveTokenAccount } from '@wallet/utils/account';
import withData from 'src/utils/withData';
import { parseSearchParams } from 'src/utils/searchParams';
import TransactionDetailsView from '../components/transactionDetailsView';
import { getTransaction } from '../api';

const mapStateToProps = (state, ownProps) => ({
  account: getActiveTokenAccount(state),
  id: ownProps.match.params.id,
  activeToken: state.token?.active ?? 'LSK',
});

const apis = {
  transaction: {
    apiUtil: (network, { token, transactionId }) =>
      getTransaction({ network, params: { transactionId } }, token),
    getApiParams: (state, ownProps) => ({
      token: state.token.active,
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
)(TransactionDetailsView);
