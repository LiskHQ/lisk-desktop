/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { settingsUpdated, timerReset } from '@actions';
import Settings from './settings';

const mapStateToProps = state => ({
  settings: state.settings,
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
