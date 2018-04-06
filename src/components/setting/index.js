import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Setting from './setting';
import { settingsUpdated } from '../../actions/settings';
import { accountUpdated } from '../../actions/account';

const mapStateToProps = state => ({
  hasSecondPassphrase: state.account.secondSignature,
  settings: state.settings,
  account: state.account,
});

const mapDispatchToProps = dispatch => ({
  settingsUpdated: data => dispatch(settingsUpdated(data)),
  accountUpdated: data => dispatch(accountUpdated(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Setting));
