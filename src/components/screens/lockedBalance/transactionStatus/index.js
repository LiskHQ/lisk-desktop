import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import TransactionStatus from './transactionStatus';

const mapStateToProps = state => ({
  transactions: state.transactions,
});

export default compose(
  connect(mapStateToProps),
  withTranslation(),
)(TransactionStatus);
