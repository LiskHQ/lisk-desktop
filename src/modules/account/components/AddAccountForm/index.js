/* istanbul ignore file */
import { connect } from 'react-redux';
import { setDefaults, withTranslation } from 'react-i18next';
import { settingsUpdated } from 'src/modules/settings/store/actions';
import AddAccountForm from './AddAccountForm';

setDefaults({
  wait: true,
  withRef: false,
  bindI18n: 'languageChanged loaded',
  bindStore: 'added removed',
  nsMode: 'default',
  withTranslationFuncName: 't',
});

const mapStateToProps = (state) => ({
  account: state.wallet,
  network: state.network,
  settings: state.settings,
});

const mapDispatchToProps = {
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AddAccountForm));
