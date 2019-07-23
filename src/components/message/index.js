// istanbul ignore file
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { getActiveTokenAccount } from '../../utils/account';
import Message from './message';

const mapStateToProps = state => ({
  transactions: state.transactions.pending,
  account: getActiveTokenAccount(state),
  settings: state.settings,
});

export default connect(mapStateToProps)(translate()(Message));
