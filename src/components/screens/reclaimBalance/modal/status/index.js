import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import Status from './status';

const mapStateToProps = state => ({
  isMigrated: state.account.info.LSK.summary.isMigrated,
  transactions: state.transactions,
  network: state.network,
});

export default compose(
  connect(mapStateToProps),
  withTranslation(),
)(Status);
