import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Status from './status';

const mapStateToProps = state => ({
  transactions: state.transactions,
  account: {
    ...state.account.info[state.settings.token.active],
    hwInfo: state.account.hwInfo,
    passphrase: state.account.passphrase,
  },
});

export default compose(
  connect(mapStateToProps),
  withRouter,
  withTranslation(),
)(Status);
