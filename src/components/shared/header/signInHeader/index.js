/* istanbul ignore file */
import { connect } from 'react-redux';
import Header from './signInHeader';
import { networkSet } from '../../../../actions/network';
import { settingsUpdated } from '../../../../actions/settings';
import networks from '../../../../constants/networks';
import { tokenMap } from '../../../../constants/tokens';
import { getAPIClient } from '../../../../utils/api/network';

// eslint-disable-next-line complexity
const mapStateToProps = state => ({
  account: state.account,
  network: state.network,
  settings: state.settings,
  selectedNetwork: (state.network.networks.LSK && state.network.networks.LSK.code)
    || networks.mainnet.code,
  address: ((state.network.networks[state.settings.token.active || tokenMap.LSK.key]
    && state.network.networks[state.settings.token.active || tokenMap.LSK.key].nodeUrl)
    || (state.settings.network && state.settings.network.name === networks.customNode.name
      && state.settings.network.address)) || '',
  liskAPIClient: getAPIClient(tokenMap.LSK.key, state),
});

const mapDispatchToProps = {
  networkSet,
  settingsUpdated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
