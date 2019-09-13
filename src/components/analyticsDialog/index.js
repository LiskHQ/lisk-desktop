/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { settingsUpdated } from '../../actions/settings';
import { toastDisplayed } from '../../actions/toaster';
import AnalyticsDialog from './analyticsDialog';

const mapStateToProps = state => ({
  settings: state.settings,
});

const mapDispatchToProps = {
  settingsUpdated,
  toastDisplayed,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  translate(),
)(AnalyticsDialog);
