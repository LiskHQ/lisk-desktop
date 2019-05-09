// istanbul ignore file
import { connect } from 'react-redux';
import { settingsUpdated } from '../../../actions/settings';
import { login } from '../../../actions/account';
import SelectAccount from './selectAccount';

const mapStateToProps = state => ({
  account: state.account,
  settings: state.settings,
});

const mapDispatchToProps = {
  login,
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectAccount);
