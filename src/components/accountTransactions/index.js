/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { searchAccount } from '../../actions/search';
import AccountTransactions from './accountTransactions';

const mapStateToProps = state => ({
  publicKey: state.account.publicKey,
  account: state.search.accounts[state.search.lastSearch] || {},
  delegate: state.search.delegates[state.search.lastSearch] || {},
});

const mapDispatchToProps = {
  searchAccount,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AccountTransactions));
