// istanbul ignore file
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import WalletDetails from './walletDetails';


const mapStateToProps = state => ({
  account: state.account,
  settings: state.settings,
});

export default connect(mapStateToProps)(translate()(WalletDetails));
