/* istanbul ignore file */
import { connect } from 'react-redux';
import { getActiveTokenAccount } from '@wallet/utilities/account';
import Form from './form';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  network: state.network,
  signedTransaction: state.transactions.signedTransaction,
  txSignatureError: state.transactions.txSignatureError,
});

export default connect(
  mapStateToProps,
)(Form);
