import { connect } from 'react-redux';
import Toaster from './toaster';
import { toastHidden } from '../../actions/toaster';

export const mapStateToProps = state => ({
  toasts: state.toaster || [],
});

export const mapDispatchToProps = dispatch => ({
  hideToast: data => dispatch(toastHidden(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Toaster);
