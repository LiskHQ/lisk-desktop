import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import WalletTransactions from '../../screens/wallet3/transactions/walletTransactions';
import { tokenMap } from '../../../constants/tokens';

import styles from './transactionDasboard.css';

class TransactionsDashboard extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div className={`${grid.row} ${styles.wrapper}`}>
        <div className={`${grid['col-xs-10']} ${grid['col-sm-12']} ${grid['col-md-12']} ${grid['col-lg-12']} ${styles.transactions}`}>
          <WalletTransactions {...this.props} />
        </div>
      </div>
    );
  }
}

const getActiveTokenAccount = state => (
  (state.account.info && state.account.info[
    state.settings.token && state.settings.token.active
      ? state.settings.token.active
      : tokenMap.LSK.key
  ]) || {}
);

const mapStateToProps = state => ({
  address: getActiveTokenAccount(state).address,
  balance: getActiveTokenAccount(state).balance,
  activeToken: state.settings.token ? state.settings.token.active : tokenMap.LSK.key,
  account: {
    ...state.account,
    ...(getActiveTokenAccount(state)),
  },
  settings: state.settings,
  pendingTransactions: state.transactions.pending,
});

export default withRouter(connect(mapStateToProps)(TransactionsDashboard));
