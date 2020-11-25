/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Settings from './settings';
import { settingsUpdated } from '../../../actions/settings';
import { timerReset } from '../../../actions/account';
import { networkSet } from '../../../actions/network';
import { getActiveTokenAccount } from '../../../utils/account';
import actionTypes from '../../../constants/actions';

const mapStateToProps = state => ({
  settings: state.settings,
  account: getActiveTokenAccount(state),
  transactions: state.transactions,
  serviceUrl: state.network.serviceUrl,
});

const mapDispatchToProps = dispatch => ({
  timerReset,
  networkSet,
  settingsUpdated,
  serviceUrlSet: (url) => {
    dispatch({
      data: url,
      type: actionTypes.serviceUrlSet,
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Settings));
