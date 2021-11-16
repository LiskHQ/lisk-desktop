/* istanbul ignore file */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '@utils/account';
import { transactionBroadcasted, resetTransactionResult } from '@actions';
import ResultComponent from './result';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  transactions: state.transactions,
});

const mapDispatchToProps = {
  resetTransactionResult,
  transactionBroadcasted,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(ResultComponent);
