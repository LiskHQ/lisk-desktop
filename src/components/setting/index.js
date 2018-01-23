import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Setting from './setting';
import { autoLogChanged, advanceModeChanged } from '../../actions/settings';

const mapStateToProps = state => ({
  hasSecondPassphrase: state.account.secondSignature,
  settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
  changeAutoLog: data => dispatch(autoLogChanged(data)),
  changeAdvancedMode: data => dispatch(advanceModeChanged(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Setting));
