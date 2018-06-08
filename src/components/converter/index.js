import { connect } from 'react-redux';

import { settingsUpdated } from '../../actions/settings';
import Converter from './converter';

const mapStateToProps = state => ({
  settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
  settingsUpdated: data => dispatch(settingsUpdated(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Converter);
