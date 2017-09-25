import { connect } from 'react-redux';
import { translate } from 'react-i18next';
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
)(translate()(Account));
