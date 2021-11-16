import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import TransactionStatus from './transactionStatus';

const mapStateToProps = state => ({
  transactions: state.transactions,
});

export default compose(
  connect(mapStateToProps),
  withRouter,
  withTranslation(),
)(TransactionStatus);
