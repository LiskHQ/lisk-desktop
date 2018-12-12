/* istanbul ignore file */
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

const mapDispatchToProps = {
  accountUpdated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Authenticate));
