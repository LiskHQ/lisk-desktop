/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '@wallet/utils/account';
import { settingsUpdated } from '@common/store/actions';
import { timerReset } from '@auth/store/action';
import SettingDialog from '../components/SettingDialog';

const mapStateToProps = state => ({
  settings: state.settings,
  transactions: state.transactions,
  account: getActiveTokenAccount(state),
});

const mapDispatchToProps = {
  timerReset,
  settingsUpdated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(SettingDialog));
