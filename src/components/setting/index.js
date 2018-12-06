/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Setting from './setting';
import { settingsUpdated } from '../../actions/settings';
import { accountUpdated } from '../../actions/account';

const mapStateToProps = state => ({
  hasSecondPassphrase: state.account.secondPublicKey,
  settings: state.settings,
  account: state.account,
  isAuthenticated: !!state.account.publicKey,
});

const mapDispatchToProps = {
  accountUpdated,
  settingsUpdated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Setting));
