import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Send from './send';

const mapStateToProps = state => ({
  account: state.account,
  pendingTransactions: state.transactions.pending,
});

export default connect(mapStateToProps)(translate()(Send));
