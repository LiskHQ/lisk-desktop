/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '@utils/account';
import { settingsUpdated, timerReset } from '@common/store/actions';
import Settings from './settings';

const mapStateToProps = state => ({
  settings: state.settings,
  transactions: state.transactions,
  account: getActiveTokenAccount(state),
});

const mapDispatchToProps = {
  timerReset,
  settingsUpdated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Settings));
