// istanbul ignore file
import { connect } from 'react-redux';
import { settingsUpdated, login } from '@actions';
import { getActiveTokenAccount } from '@utils/account';
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
