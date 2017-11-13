import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { accountSaved, accountRemoved, accountSwitched } from '../../actions/savedAccounts';
import SavedAccounts from './savedAccounts';

const mapStateToProps = state => ({
  publicKey: state.account.publicKey,
  networkOptions: state.peers.options,
  savedAccounts: state.savedAccounts.accounts,
});

const mapDispatchToProps = dispatch => ({
  accountSaved: data => dispatch(accountSaved(data)),
  accountRemoved: data => dispatch(accountRemoved(data)),
  accountSwitched: data => dispatch(accountSwitched(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(SavedAccounts));
