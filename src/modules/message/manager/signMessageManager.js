/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { signMessage } from '../store/action';
import SignMessageView from '../components/signMessageView';

/**
 * Injecting store through redux store
 */
const mapStateToProps = (state) => ({
  account: selectActiveTokenAccount(state),
});

const dispatchToProps = {
  signMessage,
};

export default compose(
  withRouter,
  connect(mapStateToProps, dispatchToProps),
  withTranslation()
)(SignMessageView);
