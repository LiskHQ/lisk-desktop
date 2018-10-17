import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { transactionsRequested, transactionsFilterSet } from '../../../actions/transactions';
import { accountVotersFetched, accountVotesFetched } from '../../../actions/account';
import { searchAccount } from '../../../actions/search';
import WalletTransactions from './walletTransactions';
import actionTypes from '../../../constants/actions';
import txFilters from './../../../constants/transactionFilters';

/* istanbul ignore next */
const mapStateToProps = state => ({
  account: state.account,
  transaction: state.transaction,
  transactions: [...state.transactions.pending, ...state.transactions.confirmed],
  votes: state.account.votes,
  voters: state.account.voters,
  count: state.transactions.count,
  // Pick delegate from source
  delegate: (state.account && state.account.delegate) ?
    state.account && (state.account.delegate || null) :
    state.search.delegates[state.account.address],
  activeFilter: state.filters.wallet || txFilters.all,
  loading: state.loading,
});

const mapDispatchToProps = dispatch => ({
  searchAccount: data => dispatch(searchAccount(data)),
  transactionsRequested: data => dispatch(transactionsRequested(data)),
  transactionsFilterSet: data => dispatch(transactionsFilterSet(data)),
  accountVotersFetched: data => dispatch(accountVotersFetched(data)),
  accountVotesFetched: data => dispatch(accountVotesFetched(data)),
  addFilter: data => dispatch({ type: actionTypes.addFilter, data }),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(WalletTransactions)));
