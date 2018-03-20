import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { accountRemoved, accountSwitched, removeSavedAccountPassphrase } from '../../actions/savedAccounts';
import { removePassphrase } from '../../actions/account';
import SavedAccounts from './savedAccounts';

const mapStateToProps = state => ({
  activeAccount: state.account,
  savedAccounts: state.savedAccounts.accounts,
});

const mapDispatchToProps = dispatch => ({
  accountRemoved: data => dispatch(accountRemoved(data)),
  accountSwitched: data => dispatch(accountSwitched(data)),
  removePassphrase: data => dispatch(removePassphrase(data)),
  removeSavedAccountPassphrase: data => dispatch(removeSavedAccountPassphrase(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(translate()(SavedAccounts)));
