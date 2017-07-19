import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import LoginFormComponent from './loginFormComponent';
import { accountUpdated } from '../../actions/account';
import { activePeerSet } from '../../actions/peers';

/**
 * Using react-redux connect to pass state and dispatch to LoginForm
 */
const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  onAccountUpdated: data => dispatch(accountUpdated(data)),
  activePeerSet: network => dispatch(activePeerSet(network)),
});

const LoginFormConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(LoginFormComponent));

export default LoginFormConnected;
