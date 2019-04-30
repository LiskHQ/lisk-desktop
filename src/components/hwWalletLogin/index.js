import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import HardwareWalletLogin from './hwWalletLogin';

const mapStateToProps = state => ({
  settings: state.settings,
});

const mapDispatchToProps = {
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(HardwareWalletLogin));
