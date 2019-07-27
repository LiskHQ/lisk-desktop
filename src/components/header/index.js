/* istanbul ignore file */
import { connect } from 'react-redux';
import Header from './header';
import { networkSet } from '../../actions/network';
import { errorToastDisplayed } from '../../actions/toaster';
import { settingsUpdated } from '../../actions/settings';
import networks from '../../constants/networks';
import { tokenMap } from '../../constants/tokens';
import { getAPIClient } from '../../utils/api/network';

const mapStateToProps = state => ({
  account: state.account,
  network: state.network,
  settings: state.settings,
  selectedNetwork: state.network.name || networks.mainnet.name,
  address: state.network.networks[state.settings.token.active || tokenMap.LSK.key].nodeUrl || '',
  liskAPIClient: getAPIClient(state.settings.token.active || tokenMap.LSK.key, state),
});

const mapDispatchToProps = {
  errorToastDisplayed,
  networkSet,
  settingsUpdated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
