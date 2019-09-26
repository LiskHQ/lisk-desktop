// istanbul ignore file
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '../../../utils/account';
import { settingsUpdated } from '../../../actions/settings';
import { errorToastDisplayed } from '../../../actions/toaster';
import { getAPIClient } from '../../../utils/api/network';
import { tokenMap } from '../../../constants/tokens';
import Splashscreen from './splashscreen';

const mapStateToProps = state => ({
  network: state.network,
  account: getActiveTokenAccount(state),
  settings: state.settings,
  liskAPIClient: getAPIClient(tokenMap.LSK.key, state),
});

const mapDispatchToProps = {
  errorToastDisplayed,
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Splashscreen));
