/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { liskAPIClientSet } from '../../actions/peers';
import Register from './register';
import getNetwork from '../../utils/getNetwork';

const mapDispatchToProps = {
  liskAPIClientSet,
};

const mapStateToProps = state => ({
  account: state.account,
  network: state.peers.options || getNetwork(0),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Register));
