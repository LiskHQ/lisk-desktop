import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { multisigTransactionSigned, transactionDoubleSigned, signatureSkipped } from '@common/store/actions';
import { withTranslation } from 'react-i18next';
import TxSignatureCollector from './TxSignatureCollector';

const mapStateToProps = state => ({
  transactions: state.transactions,
  account: state.wallet,
});

const dispatchToProps = {
  multisigTransactionSigned,
  transactionDoubleSigned,
  signatureSkipped,
};

export default compose(
  withRouter,
  connect(mapStateToProps, dispatchToProps),
  withTranslation(),
)(TxSignatureCollector);
