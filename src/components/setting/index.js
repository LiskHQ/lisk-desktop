import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Setting from './setting';
import { settingsUpdated } from '../../actions/settings';

const mapStateToProps = state => ({
  hasSecondPassphrase: state.account.secondSignature,
  settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
  settingsUpdated: data => dispatch(settingsUpdated(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Setting));
