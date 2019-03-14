/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import TransactionStatus from './transactionStatus';
import actionTypes from '../../../constants/actions';

const mapStateToProps = state => ({
  failedTransactions: state.transactions.failed,
});

const mapDispatchToProps = {
  transactionFailedClear: () => ({
    type: actionTypes.transactionFailedClear,
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TransactionStatus));
