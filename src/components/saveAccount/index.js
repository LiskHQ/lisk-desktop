import { connect } from 'react-redux';
import { accountSaved } from '../../actions/savedAccounts';
import SaveAccount from './saveAccount';

const mapStateToProps = state => ({
  address: state.peers.data.options.address,
  publicKey: state.account.publicKey,
  network: state.peers.data.options.name,
});

const mapDispatchToProps = dispatch => ({
  accountSaved: data => dispatch(accountSaved(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaveAccount);
