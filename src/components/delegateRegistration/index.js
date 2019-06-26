/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import { transactionBroadcasted } from '../../actions/transactions';
import DelegateRegistration from './delegateRegistration';

const mapStateToProps = state => ({
  account: state.account,
  transactions: state.transactions,
  network: state.network,
});

const mapDispatchToProps = {
  transactionBroadcasted,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(DelegateRegistration)));
