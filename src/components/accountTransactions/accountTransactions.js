import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import ExplorerTransactions from './../transactions/explorerTransactions';
import ExplorerTransactionsV2 from './../transactionsV2/explorerTransactionsV2';
import SendTo from '../sendTo';
import styles from './accountTransactions.css';
import routes from '../../constants/routes';

class AccountTransactions extends React.Component {
  render() {
    const explorerRoute = `${routes.accountsV2.pathPrefix}${routes.accountsV2.path}`;
    const { match } = this.props;

    return match.url.indexOf(explorerRoute) === -1 ? (
      <div className={`${grid.row} ${styles.wrapper}`}>
        <div className={`${grid['col-md-4']} ${styles.sendTo}`}>
          <SendTo
            address={this.props.match.params.address}
            t={this.props.t}
            account={this.props.account}
            delegate={this.props.delegate}
          />
        </div>
        <div className={`${grid['col-sm-12']} ${styles.transactions} ${grid['col-md-8']} ${styles.transactions}`}>
          <ExplorerTransactions
            history={this.props.history}
            address={this.props.match.params.address}
            delegate={this.props.delegate} />
        </div>
      </div>
    ) : (
      <div className={`${grid.row}`}>
        <div className={`${grid['col-xs-10']} ${grid['col-sm-12']} ${grid['col-md-12']} ${grid['col-lg-12']} ${styles.transactions}`}>
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
