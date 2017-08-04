import { connect } from 'react-redux';
import Send from './send';
import { successAlertDialogDisplayed, errorAlertDialogDisplayed } from '../../actions/dialog';
import { transactionAdded } from '../../actions/transactions';

const mapStateToProps = state => ({
  account: state.account,
  activePeer: state.peers.data,
});

const mapDispatchToProps = dispatch => ({
  showSuccessAlert: data => dispatch(successAlertDialogDisplayed(data)),
  showErrorAlert: data => dispatch(errorAlertDialogDisplayed(data)),
  addTransaction: data => dispatch(transactionAdded(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Send);

