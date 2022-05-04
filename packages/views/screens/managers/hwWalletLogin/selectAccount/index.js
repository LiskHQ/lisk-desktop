// istanbul ignore file
import { connect } from 'react-redux';
import { settingsUpdated } from 'src/modules/settings/store/actions';
import { login } from '@auth/store/action';
import { getActiveTokenAccount } from '@wallet/utils/account';
import SelectAccount from './selectAccount';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  settings: state.settings,
  network: state.network,
});

const mapDispatchToProps = {
  login,
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectAccount);
