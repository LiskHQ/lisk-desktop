/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { sent } from '../../../actions/transactions';
import { tokenMap } from '../../../constants/tokens';
import Summary from './summary';

const mapStateToProps = state => ({
  account: state.account,
  failedTransactions: state.transactions.failed,
  pendingTransactions: state.transactions.pending,
  token: localStorage.getItem('btc') ? state.settings.token.active : tokenMap.LSK.key,
});

const mapDispatchToProps = {
  sent,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Summary));
