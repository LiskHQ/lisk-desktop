import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';
import { successToastDisplayed } from '../../actions/toaster';
import SignMessageComponent from './signMessageComponent';

const mapDispatchToProps = dispatch => ({
  successToast: data => dispatch(successToastDisplayed(data)),
  copyToClipboard: (...args) => copy(...args),
});

export default connect(
  null,
  mapDispatchToProps,
)(SignMessageComponent);
