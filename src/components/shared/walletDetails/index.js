// istanbul ignore file
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import WalletDetails from './walletDetails';

const mapStateToProps = state => ({
  account: state.account,
  settings: state.settings,
});

export default connect(mapStateToProps)(withTranslation()(WalletDetails));
