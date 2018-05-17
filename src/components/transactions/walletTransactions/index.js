import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { loadTransactions, transactionsRequested, transactionsFilterSet } from '../../../actions/transactions';
import { accountVotersFetched, accountVotesFetched } from '../../../actions/account';
import WalletTransactions from './walletTransactions';

const mapStateToProps = state => ({
  activePeer: state.peers.data,
  transactions: [...state.transactions.pending, ...state.transactions.confirmed],
  votes: state.account.votes,
  voters: state.account.voters,
  count: state.transactions.count,
  delegate: state.account && (state.account.delegate || {}),
  activeFilter: state.transactions.filter,
  loading: state.loading,
});

const mapDispatchToProps = dispatch => ({
  loadTransactions: data => dispatch(loadTransactions(data)),
  transactionsRequested: data => dispatch(transactionsRequested(data)),
  transactionsFilterSet: data => dispatch(transactionsFilterSet(data)),
  accountVotersFetched: data => dispatch(accountVotersFetched(data)),
  accountVotesFetched: data => dispatch(accountVotesFetched(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(translate()(WalletTransactions)),
);
