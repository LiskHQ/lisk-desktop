import { connect } from 'react-redux';
import RegisterDelegate from './registerDelegate';
import { delegateRegistered } from '../../actions/account';

const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  delegateRegistered: data => dispatch(delegateRegistered(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterDelegate);
