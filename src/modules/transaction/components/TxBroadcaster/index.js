// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { transactionBroadcasted, resetTransactionResult } from 'src/redux/actions';
import { selectActiveToken, selectActiveTokenAccount, selectNetwork } from 'src/redux/selectors';
import TxBroadcaster from './TxBroadcaster';

const mapStateToProps = (state) => ({
  activeToken: selectActiveToken(state),
  transactions: state.transactions,
  account: selectActiveTokenAccount(state),
  network: selectNetwork(state),
});

const mapDispatchToProps = {
  transactionBroadcasted,
  resetTransactionResult,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(TxBroadcaster);
