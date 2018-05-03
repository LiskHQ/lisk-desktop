import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { transactionsRequestInit } from '../../actions/transactions';
import { accountVotersFetched, accountVotesFetched } from '../../actions/account';
import Transactions from './../transactions';
import SendTo from '../sendTo';
import styles from './accountTransactions.css';

class accountTransactions extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.address !== this.props.match.params.address) {
      this.props.transactionsRequestInit({ address: nextProps.match.params.address });
    }
  }

  componentDidUpdate(prevProps) {
    const { peers, match, delegate } = this.props;

    if (prevProps.delegate !== delegate) {
      if (delegate && delegate.publicKey) {
        this.props.accountVotersFetched({
          activePeer: peers.data,
          publicKey: delegate.publicKey,
        });
        this.props.accountVotesFetched({
          activePeer: peers.data,
          address: match.params.address,
        });
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return <div className={`${grid.row} ${styles.wrapper}`}>
      <div className={`${grid['col-md-4']} ${styles.sendTo}`}>
        <SendTo
          balance={this.props.balance}
          address={this.props.match.params.address}
          delegateUsername={this.props.delegateUsername}
          t={this.props.t}
          notLoading={this.props.notLoading}
        />
      </div>
      <div className={`${grid['col-sm-12']} ${styles.transactions} ${grid['col-md-8']}`}>
        <Transactions
          history={this.props.history}
          address={this.props.match.params.address}
          balance={this.props.balance}
          delegate={this.props.delegate} />
      </div>
    </div>;
  }
}

const mapStateToProps = state => ({
  delegateUsername: (state.account && state.account.delegate)
    ? state.account.delegate.username : null,
  balance: state.transactions.account ? state.transactions.account.balance : null,
  notLoading: state.loading.length === 0,
  peers: state.peers,
  delegate: state.account && state.account.delegate,
});

const mapDispatchToProps = dispatch => ({
  transactionsRequestInit: data => dispatch(transactionsRequestInit(data)),
  accountVotersFetched: data => dispatch(accountVotersFetched(data)),
  accountVotesFetched: data => dispatch(accountVotesFetched(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(accountTransactions));
