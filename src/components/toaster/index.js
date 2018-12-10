/* istanbul ignore file */
import { connect } from 'react-redux';
import Toaster from './toaster';
import { toastHidden } from '../../actions/toaster';

export const mapStateToProps = state => ({
  toasts: state.toaster || [],
});

export const mapDispatchToProps = {
  hideToast: toastHidden,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Toaster);
