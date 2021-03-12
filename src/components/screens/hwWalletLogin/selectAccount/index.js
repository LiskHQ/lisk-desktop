// istanbul ignore file
import { connect } from 'react-redux';
import { settingsUpdated } from 'actions';
import { getActiveTokenAccount } from 'utils/account';
import { login } from 'actions';
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
