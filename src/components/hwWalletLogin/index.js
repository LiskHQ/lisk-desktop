/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { updateDeviceList } from '../../actions/hwWallets';
import { getAPIClient } from '../../utils/api/network';
import { tokenMap } from '../../constants/tokens';
import { settingsUpdated } from '../../actions/settings';
import HardwareWalletLogin from './hwWalletLogin';

const mapStateToProps = state => ({
  // TODO update this when isHarwareWalletConnected is refactored and we have devices in store
  devices: state.hwWallets.devices,
  liskAPIClient: getAPIClient(state.settings.token.active || tokenMap.LSK.key, state),
});

const mapDispatchToProps = {
  updateDeviceList,
  settingsUpdated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(HardwareWalletLogin));
