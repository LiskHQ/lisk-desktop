import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import copy from 'copy-to-clipboard';
import { successToastDisplayed, errorToastDisplayed } from '../../actions/toaster';
import EncryptMessage from './encryptMessage';

const mapStateToProps = state => ({
  account: state.account,
});

const mapDispatchToProps = dispatch => ({
  successToast: data => dispatch(successToastDisplayed(data)),
  errorToast: data => dispatch(errorToastDisplayed(data)),
  copyToClipboard: (...args) => copy(...args),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(EncryptMessage));
