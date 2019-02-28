/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { testExtensions, loadTransactions, sent } from '../../actions/transactions';
import ExtensionPoint from './extensionPoint';

const mapStateToProps = state => ({
  modules: (state.extensions && state.extensions.modules) || {},
  test: state.transactions.test,
  blocks: state.blocks,
  transactions: state.transactions,
});

const mapDispatchToProps = {
  testExtensions,
  loadTransactions,
  sent,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ExtensionPoint));

