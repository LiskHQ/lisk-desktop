/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { settingsUpdated } from 'actions';
import { timerReset } from 'actions';
import { getActiveTokenAccount } from 'utils/account';
import Settings from './settings';

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
