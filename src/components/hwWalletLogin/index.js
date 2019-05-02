/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { devicesListUpdated } from '../../actions/hwWallets';
import HardwareWalletLogin from './hwWalletLogin';

const mapStateToProps = state => ({
  // TODO update this when isHarwareWalletConnected is refactored and we have devices in store
  devices: state.hwWallets.devices,
});

const mapDispatchToProps = {
  devicesListUpdated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(HardwareWalletLogin));
