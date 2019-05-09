// istanbul ignore file
import { connect } from 'react-redux';
import { settingsUpdated } from '../../../actions/settings';
import { errorToastDisplayed } from '../../../actions/toaster';
import { login } from '../../../actions/account';
import SelectAccount from './selectAccount';

const mapStateToProps = state => ({
  account: state.account,
  settings: state.settings,
});

const mapDispatchToProps = {
  login,
  settingsUpdated,
  errorToastDisplayed,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectAccount);
