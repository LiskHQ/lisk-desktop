import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { sent } from '../../../../actions/transactions';
import Confirm from './confirm';

const mapStateToProps = state => ({
  account: state.account,
  pendingTransactions: state.transactions.pending,
  failedTransactions: state.transactions.failed,
  followedAccounts: state.followedAccounts ? state.followedAccounts.accounts : [],
});

const mapDispatchToProps = dispatch => ({
  sent: data => dispatch(sent(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Confirm));
