import { connect } from 'react-redux';
import LoginFormComponent from './loginFormComponent';
import { accountUpdated } from '../../actions/account';

/**
 * Using react-redux connect to pass state and dispatch to LoginForm
 */
const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  onAccountUpdated: data => dispatch(accountUpdated(data)),
});

const LoginFormConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginFormComponent);

export default LoginFormConnected;
