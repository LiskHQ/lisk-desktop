/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import { secondPassphraseRegistered } from '../../actions/account';
import SecondPassphrase from './secondPassphrase';

/**
 * Injecting store through redux store
 */
const mapStateToProps = state => ({
  account: state.account,
});

const mapDispatchToProps = dispatch => ({
  registerSecondPassphrase: data => dispatch(secondPassphraseRegistered(data)),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(SecondPassphrase)));
