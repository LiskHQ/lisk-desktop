import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import ExplorerTransactions from '../transactions/explorerTransactions';
import styles from './accountTransactions.css';

class AccountTransactions extends React.Component {
  render() {
    return (
      <div className={`${grid.row}`}>
        <div className={`${grid['col-xs-12']} ${styles.transactions}`}>
          <ExplorerTransactions
            history={this.props.history}
            address={this.props.match.params.address}
            delegate={this.props.delegate}
          />
        </div>
      </div>
    );
  }
}

export default AccountTransactions;
