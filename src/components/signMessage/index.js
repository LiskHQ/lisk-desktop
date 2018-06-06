/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import SignMessage from './signMessage';

/**
 * Injecting store through redux store
 */
const mapStateToProps = state => ({
  account: state.account,
});

export default withRouter(connect(mapStateToProps)(translate()(SignMessage)));
