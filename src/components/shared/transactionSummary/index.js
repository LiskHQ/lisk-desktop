/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import TransactionSummary from './transactionSummary';

const mapStateToProps = state => ({
  account: state.account,
  token: state.settings.token.active,
});

export default connect(mapStateToProps, {})(withTranslation()(TransactionSummary));
