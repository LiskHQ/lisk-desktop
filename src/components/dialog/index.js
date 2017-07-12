import { connect } from 'react-redux';
import { dialogHidden } from '../../actions/dialog';
import DialogElement from './dialogElement';

const mapStateToProps = state => ({
  dialog: state.dialog,
});

const mapDispatchToProps = dispatch => ({
  onCancelClick: () => dispatch(dialogHidden()),
});

const Dialog = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DialogElement);

export default Dialog;
