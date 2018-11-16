import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Form from './form';

const mapStateToProps = state => ({
  account: state.account,
  pendingTransactions: state.transactions[state.account.address] ?
    state.transactions[state.account.address].pending : [],
  followedAccounts: state.followedAccounts.accounts,
});

export default connect(mapStateToProps)(translate()(Form));
