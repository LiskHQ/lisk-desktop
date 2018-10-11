import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import ExplorerTransactions from './../transactions/explorerTransactions';
import SendTo from '../sendTo';
import styles from './accountTransactions.css';

class AccountTransactions extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return <div className={`${grid.row} ${styles.wrapper}`}>
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
    </div>;
  }
}

const mapStateToProps = state => ({
  publicKey: state.account.publicKey,
  account: state.search.accounts[state.search.lastSearch] || {},
  delegate: state.search.delegates[state.search.lastSearch] || {},
});

export default connect(mapStateToProps)(translate()(AccountTransactions));
