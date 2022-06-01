/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';

import { selectActiveTokenAccount } from '@common/store';
import SignMessageView from '../components/signMessageView';

/**
 * Injecting store through redux store
 */
const mapStateToProps = state => ({
  account: selectActiveTokenAccount(state),
});

export default compose(
  withRouter,
  connect(mapStateToProps),
  withTranslation(),
)(SignMessageView);
