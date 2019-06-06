// istanbul ignore file
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import MyAccount from './myAccount';


const mapStateToProps = state => ({
  account: state.account,
  settings: state.settings,
});

export default connect(mapStateToProps)(translate()(MyAccount));
