import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { dialogDisplayed } from '../../actions/dialog';
import LoginForm from './loginForm';
import { activePeerSet } from '../../actions/peers';

/**
 * Using react-redux connect to pass state and dispatch to LoginForm
 */
const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  activePeerSet: data => dispatch(activePeerSet(data)),
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(LoginForm));
