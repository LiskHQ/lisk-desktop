import { connect } from 'react-redux';
import { dialogDisplayed } from '../../actions/dialog';
import { secondPassphraseRegistered } from '../../actions/account';
import SecondPassphrase from './secondPassphrase';

/**
 * Injecting store through redux store
 */
const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  registerSecondPassphrase: data => dispatch(secondPassphraseRegistered(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SecondPassphrase);
