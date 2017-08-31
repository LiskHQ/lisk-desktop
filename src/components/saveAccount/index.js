import { connect } from 'react-redux';
import { successToastDisplayed } from '../../actions/toaster';
import SaveAccount from './saveAccount';

const mapStateToProps = state => ({
  account: state.account,
});

const mapDispatchToProps = dispatch => ({
  successToast: data => dispatch(successToastDisplayed(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaveAccount);
