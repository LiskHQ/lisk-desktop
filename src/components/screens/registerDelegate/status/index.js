/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { transactionBroadcasted, resetTransactionResult } from '@actions';
import { getActiveTokenAccount } from '@utils/account';
import Status from './status';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  transactions: state.transactions,
  network: state.network,
});

const mapDispatchToProps = {
  transactionBroadcasted,
  resetTransactionResult,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Status)));
