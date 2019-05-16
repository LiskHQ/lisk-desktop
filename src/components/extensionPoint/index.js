/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import {
  loadTransactions,
  sent,
  loadTransaction,
  transactionsRequested,
} from '../../actions/transactions';
import {
  searchDelegate,
  searchVotes,
  searchAccount,
  searchTransactions,
} from '../../actions/search';
import ExtensionPoint from './extensionPoint';

const mapStateToProps = state => ({
  modules: (state.extensions && state.extensions.modules) || {},
  test: state.transactions.test,
  blocks: state.blocks,
  transactions: state.transactions,
  account: state.account,
  search: state.search,
});

const mapDispatchToProps = {
  loadTransactions,
  sent,
  loadTransaction,
  transactionsRequested,
  searchDelegate,
  searchVotes,
  searchAccount,
  searchTransactions,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ExtensionPoint));

