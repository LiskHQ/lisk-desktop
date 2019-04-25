import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';

import { liskAPIClientSet } from '../../actions/peers';
import { settingsUpdated } from '../../actions/settings';
import { errorToastDisplayed } from '../../actions/toaster';
import TrezorLogin from './trezorLogin';

const mapStateToProps = state => ({
  liskAPIClient: state.peers && state.peers.liskAPIClient,
  settings: state.settings,
});

const mapDispatchToProps = {
  liskAPIClientSet,
  settingsUpdated,
  errorToastDisplayed,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(translate()(TrezorLogin)));
