/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Settings from './settings';
import { settingsUpdated } from '../../../actions/settings';
import { timerReset } from '../../../actions/account';
import { getActiveTokenAccount } from 'utils/account';

const mapStateToProps = state => ({
  settings: state.settings,
  account: getActiveTokenAccount(state),
  transactions: state.transactions,
});

const mapDispatchToProps = {
  timerReset,
  settingsUpdated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Settings));
