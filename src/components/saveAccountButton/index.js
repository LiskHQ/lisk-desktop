import { connect } from 'react-redux';

import { dialogDisplayed } from '../../actions/dialog';
import { successToastDisplayed } from '../../actions/toaster';
import SaveAccountButton from './saveAccountButton';

const mapStateToProps = state => ({
  account: state.account,
});

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  successToast: data => dispatch(successToastDisplayed(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaveAccountButton);
