/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { getActiveTokenAccount } from '../../../utils/account';
import { secondPassphraseRegistered } from '../../../actions/account';
import SecondPassphrase from './secondPassphrase';

/**
 * Injecting store through redux store
 */
const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
});

const mapDispatchToProps = {
  secondPassphraseRegistered,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(SecondPassphrase)));
