/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Setting from './setting';
import { settingsUpdated } from '../../actions/settings';
import { toastDisplayed } from '../../actions/toaster';
import { accountUpdated } from '../../actions/account';
import { getActiveTokenAccount } from '../../utils/account';

const mapStateToProps = state => ({
  hasSecondPassphrase: !!(state.account.info && state.account.info.LSK.secondPublicKey),
  settings: state.settings,
  account: getActiveTokenAccount(state),
  isAuthenticated: !!state.account.info,
  transactions: state.transactions,
});

const mapDispatchToProps = {
  accountUpdated,
  settingsUpdated,
  toastDisplayed,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Setting));
