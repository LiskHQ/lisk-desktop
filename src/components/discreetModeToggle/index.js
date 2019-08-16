/* istanbul ignore file */
import { connect } from 'react-redux';
import { settingsUpdated } from '../../actions/settings';
import DiscreetModeToggle from './discreetModeToggle';

const mapStateToProps = state => ({
  isDiscreetMode: state.settings.discreetMode,
});

const mapDispatchToProps = {
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(DiscreetModeToggle);
