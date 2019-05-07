// istanbul ignore file
import { connect } from 'react-redux';
import { settingsUpdated } from '../../../actions/settings';
import { liskAPIClientSet } from '../../../actions/peers';
import networks from '../../../constants/networks';
import SelectAccount from './selectAccount';

const mapStateToProps = state => ({
  account: state.account,
  network: state.settings.network || networks.mainnet.code,
  settings: state.settings,
});

const mapDispatchToProps = {
  liskAPIClientSet,
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectAccount);
