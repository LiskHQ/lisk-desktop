/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {
  getTransactions,
  sent,
} from '../../../actions/transactions';
import ExtensionPoint from './extensionPoint';

const mapStateToProps = state => ({
  modules: (state.extensions && state.extensions.modules) || {},
  test: state.transactions.test,
  blocks: state.blocks,
  transactions: state.transactions,
  account: state.account,
});

const mapDispatchToProps = {
  getTransactions,
  sent,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ExtensionPoint));
