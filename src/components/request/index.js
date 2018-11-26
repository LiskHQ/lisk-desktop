import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { settingsUpdated } from '../../actions/settings';
import Receive from './receive';

const mapStateToProps = state => ({
  address: state.account.address,
  isMessage: state.settings.requestMessage,
});

const mapDispatchToProps = {
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Receive));
