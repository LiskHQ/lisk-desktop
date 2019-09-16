/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { getAPIClient } from '../../utils/api/network';
import { settingsUpdated } from '../../actions/settings';
import { tokenMap } from '../../constants/tokens';
import HardwareWalletLogin from './hwWalletLogin';

const mapStateToProps = state => ({
  liskAPIClient: getAPIClient(state.settings.token.active || tokenMap.LSK.key, state),
});

const mapDispatchToProps = {
  settingsUpdated,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  translate(),
)(HardwareWalletLogin);
