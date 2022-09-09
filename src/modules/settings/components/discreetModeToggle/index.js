/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { settingsUpdated } from 'src/redux/actions';
import DiscreetModeToggle from './discreetModeToggle';

const mapStateToProps = (state) => ({
  isDiscreetMode: state.settings.discreetMode,
});

const mapDispatchToProps = {
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(DiscreetModeToggle));
