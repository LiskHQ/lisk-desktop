import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Status from './status';

const mapStateToProps = state => ({
  transactions: state.transactions,
  account: {
    ...state.wallet.info[state.token.active],
    hwInfo: state.wallet.hwInfo,
    passphrase: state.wallet.passphrase,
  },
});

export default compose(
  connect(mapStateToProps),
  withRouter,
  withTranslation(),
)(Status);
