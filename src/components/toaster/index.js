import { connect } from 'react-redux';
import ToasterComponent from './toasterComponent';
import { toastHidden } from '../../actions/toaster';

const mapStateToProps = state => ({
  toasts: state.toaster || [],
});

const mapDispatchToProps = dispatch => ({
  hideToast: data => dispatch(toastHidden(data)),
});

const Toaster = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToasterComponent);

export default Toaster;
