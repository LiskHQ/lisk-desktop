/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { getActiveTokenAccount } from '../../../utils/account';
import SecondPassphrase from './secondPassphrase';

/**
 * Injecting store through redux store
 */
const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
});

export default withRouter(connect(
  mapStateToProps,
)(withTranslation()(SecondPassphrase)));
