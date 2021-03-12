/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { transactionBroadcasted } from 'actions/transactions';
import { getActiveTokenAccount } from 'utils/account';
import registerDelegate from './registerDelegate';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  transactions: state.transactions,
  network: state.network,
});

const mapDispatchToProps = {
  transactionBroadcasted,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(registerDelegate)));
