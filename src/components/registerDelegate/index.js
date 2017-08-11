import { connect } from 'react-redux';
import RegisterDelegate from './registerDelegate';
import { accountUpdated } from '../../actions/account';
import { transactionAdded } from '../../actions/transactions';
import { successAlertDialogDisplayed, errorAlertDialogDisplayed } from '../../actions/dialog';

const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  onAccountUpdated: data => dispatch(accountUpdated(data)),
  showSuccessAlert: data => dispatch(successAlertDialogDisplayed(data)),
  showErrorAlert: data => dispatch(errorAlertDialogDisplayed(data)),
  addTransaction: data => dispatch(transactionAdded(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterDelegate);
