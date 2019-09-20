/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { settingsUpdated } from '../../actions/settings';
import HardwareWalletLogin from './hwWalletLogin';

const mapStateToProps = state => ({
  network: state.network,
});

const mapDispatchToProps = {
  settingsUpdated,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  translate(),
)(HardwareWalletLogin);
