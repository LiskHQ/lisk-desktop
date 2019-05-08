/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { updateDeviceList } from '../../actions/hwWallets';
import HardwareWalletLogin from './hwWalletLogin';

const mapStateToProps = state => ({
  // TODO update this when isHarwareWalletConnected is refactored and we have devices in store
  devices: state.hwWallets.devices,
});

const mapDispatchToProps = {
  updateDeviceList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(HardwareWalletLogin));
