import { connect } from 'react-redux';
import Account from './account';

/**
 * Passing state
 */
const mapStateToProps = state => ({
  peers: state.peers,
  account: state.account,
});

export default connect(
  mapStateToProps,
)(Account);
