import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import TransactionStatus from './transactionStatus';
import { transactionBroadcasted } from '../../../../actions/transactions';

const mapStateToProps = state => ({
  transactions: state.transactions,
});

const mapDispatchToProps = {
  transactionBroadcasted,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  withTranslation(),
)(TransactionStatus);
