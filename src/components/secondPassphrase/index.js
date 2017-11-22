import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { dialogDisplayed } from '../../actions/dialog';
import { secondPassphraseRegistered } from '../../actions/account';
import SecondPassphrase from './secondPassphrase';

/**
 * Injecting store through redux store
 */
const mapStateToProps = state => ({
  account: state.account,
  passphrase: state.account.passphrase,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  registerSecondPassphrase: data => dispatch(secondPassphraseRegistered(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(SecondPassphrase));
