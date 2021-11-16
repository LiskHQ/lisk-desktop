// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { transactionBroadcasted, resetTransactionResult } from '@actions';
import TransactionResult from './transactionResult';

const mapStateToProps = state => ({
  activeToken: state.settings.token.active,
  transactions: state.transactions,
  account: state.account,
});

const mapDispatchToProps = {
  transactionBroadcasted,
  resetTransactionResult,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(TransactionResult);
