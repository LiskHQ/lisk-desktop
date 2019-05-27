/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { transactionCreated, resetTransactionResult } from '../../../actions/transactions';
import { tokenMap } from '../../../constants/tokens';
import Summary from './summary';

const mapStateToProps = state => ({
  account: state.account,
  transactions: state.transactions,
  token: localStorage.getItem('btc') ? state.settings.token.active : tokenMap.LSK.key,
});

const mapDispatchToProps = {
  transactionCreated,
  resetTransactionResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Summary));
