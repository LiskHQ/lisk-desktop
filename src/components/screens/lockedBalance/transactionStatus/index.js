import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import TransactionStatus from './transactionStatus';

const mapStateToProps = state => ({
  transactions: state.transactions,
});

const mapDispatchToProps = {
  // TODO conect with the correct redux action once it is created
  transactionBroadcasted: data => ({
    type: 'undefined',
    data,
  }),
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  withTranslation(),
)(TransactionStatus);
