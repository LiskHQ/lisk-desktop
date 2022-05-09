/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';

import { getActiveTokenAccount } from '@wallet/utils/account';
import SignMessageView from '../components/signMessageView';

/**
 * Injecting store through redux store
 */
const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
});

export default compose(
  withRouter,
  connect(mapStateToProps),
  withTranslation(),
)(SignMessageView);
