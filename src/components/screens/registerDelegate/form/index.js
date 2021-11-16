/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '@utils/account';
import Form from './form';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  transactions: state.transactions,
  network: state.network,
  signedTransaction: state.transactions.signedTransaction,
  txSignatureError: state.transactions.txSignatureError,
});

export default connect(
  mapStateToProps,
)(withTranslation()(Form));
