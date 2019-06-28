import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import ExplorerTransactionsV2 from './../transactionsV2/explorerTransactionsV2';
import styles from './accountTransactions.css';

class AccountTransactions extends React.Component {
  render() {
    return (
      <div className={`${grid.row}`}>
        <div className={`${grid['col-xs-12']} ${styles.transactions}`}>
          <ExplorerTransactionsV2
            history={this.props.history}
            address={this.props.match.params.address}
            delegate={this.props.delegate} />
        </div>
      </div>
    );
  }
}

export default AccountTransactions;
