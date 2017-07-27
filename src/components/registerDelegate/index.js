import { connect } from 'react-redux';
import RegisterDelegate from './registerDelegate';
import { accountUpdated } from '../../actions/account';

/**
 * Using react-redux connect to pass state and dispatch to RegisterDelegate
 */
const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  onAccountUpdated: data => dispatch(accountUpdated(data)),
});

const RegisterDelegateConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterDelegate);

export default RegisterDelegateConnected;
