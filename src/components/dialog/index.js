import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { dialogHidden, dialogDisplayed } from '../../actions/dialog';
import Dialog from './dialog';

const mapStateToProps = state => ({
  dialog: state.dialog,
});

const mapDispatchToProps = dispatch => ({
  onCancelClick: () => dispatch(dialogHidden()),
  dialogDisplayed: options => dispatch(dialogDisplayed(options)),
  dialogHidden: () => dispatch(dialogHidden()),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dialog));
