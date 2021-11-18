// istanbul ignore file
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { multisigTransactionSigned } from '@actions';
import { withTranslation } from 'react-i18next';
import TransactionSignature from './transactionSignature';

const mapStateToProps = state => ({
  activeToken: state.settings.token.active,
  transactions: state.transactions,
  account: state.account,
});

const dispatchToProps = {
  multisigTransactionSigned,
};

export default compose(
  withRouter,
  connect(mapStateToProps, dispatchToProps),
  withTranslation(),
)(TransactionSignature);
