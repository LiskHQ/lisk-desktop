import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Status from './status';

const mapStateToProps = state => ({
  isMigrated: state.account.info.LSK.summary.isMigrated,
  transactions: state.transactions,
  network: state.network,
});

export default compose(
  withRouter,
  connect(mapStateToProps),
  withTranslation(),
)(Status);
