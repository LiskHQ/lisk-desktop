import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';
import { successToastDisplayed } from '../../actions/toaster';
import SignMessage from './signMessage';

const mapStateToProps = state => ({
  account: state.account,
});

const mapDispatchToProps = dispatch => ({
  successToast: data => dispatch(successToastDisplayed(data)),
  copyToClipboard: (...args) => copy(...args),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignMessage);
