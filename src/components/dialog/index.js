import { connect } from 'react-redux';
import { dialogHidden } from '../../actions/dialog';
import Dialog from './dialog';

const mapStateToProps = state => ({
  dialog: state.dialog,
});

const mapDispatchToProps = dispatch => ({
  onCancelClick: () => dispatch(dialogHidden()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dialog);
