import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { accountUpdated } from '../../actions/account';
import Authenticate from './authenticate';

/**
 * Passing state
 */
const mapStateToProps = state => ({
  peers: state.peers,
  account: state.account,
});

const mapDispatchToProps = dispatch => ({
  accountUpdated: data => dispatch(accountUpdated(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Authenticate));
