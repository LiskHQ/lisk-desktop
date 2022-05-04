// istanbul ignore file
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import WalletDetails from '../../holdings/walletDetails/walletDetails';

const mapStateToProps = state => ({
  wallet: state.wallet,
  token: state.token,
});

export default connect(mapStateToProps)(withTranslation()(WalletDetails));
