import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { settingsUpdated } from '../../actions/settings';
import Request from './request';

const mapStateToProps = state => ({
  address: state.account.address,
  isRequestHowItWorksDisable: state.settings.isRequestHowItWorksDisable,
});

const mapDispatchToProps = {
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Request));
