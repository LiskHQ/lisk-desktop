import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import Status from './status';

const mapStateToProps = state => ({
  transactions: state.transactions,
  account: {
    ...state.wallet.info[state.settings.token.active],
    hwInfo: state.wallet.hwInfo,
    passphrase: state.wallet.passphrase,
  },
});

export default compose(
  connect(mapStateToProps),
  withTranslation(),
)(Status);
