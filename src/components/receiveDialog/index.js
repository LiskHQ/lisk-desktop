import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';

import { dialogDisplayed } from '../../actions/dialog';
import { successToastDisplayed } from '../../actions/toaster';
import ReceiveDialog from './receiveDialog';

const mapStateToProps = state => ({
  address: state.account.address,
});

const mapDispatchToProps = dispatch => ({
  successToast: data => dispatch(successToastDisplayed(data)),
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  copyToClipboard: (...args) => copy(...args),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReceiveDialog);
