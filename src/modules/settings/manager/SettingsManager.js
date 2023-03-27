/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { settingsUpdated } from 'src/redux/actions';
import SettingDialog from '../components/SettingDialog';

const mapStateToProps = (state) => ({
  settings: state.settings,
  transactions: state.transactions,
  account: selectActiveTokenAccount(state),
});

const mapDispatchToProps = {
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SettingDialog));
