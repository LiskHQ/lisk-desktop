import { connect } from 'react-redux';
import ToasterComponent from './toasterComponent';
import { toastHidden } from '../../actions/toaster';

const mapStateToProps = state => (state.toaster || {});

const mapDispatchToProps = dispatch => ({
  hideToast: () => dispatch(toastHidden()),
});

const Toaster = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToasterComponent);

export default Toaster;
