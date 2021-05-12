/* istanbul ignore file */
import { connect } from 'react-redux';
import NetworkSelector from './networkSelector';
import { networkSet, networkStatusUpdated } from '../../../../actions/network';
import { settingsUpdated } from '../../../../actions/settings';

const mapStateToProps = state => ({
  network: state.network,
});

const mapDispatchToProps = {
  networkSet,
  settingsUpdated,
  networkStatusUpdated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NetworkSelector);
