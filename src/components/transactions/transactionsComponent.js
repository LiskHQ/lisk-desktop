import React from 'react';
import Waypoint from 'react-waypoint';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import { transactions } from '../../utils/api/account';
import TransactionsHeader from './transactionsHeader';
import TransactionRow from './transactionRow';

class Transactions extends React.Component {
  constructor() {
    super();
    this.state = {
      canLoadMore: true,
    };
  }

  loadMore() {
    if (this.state.canLoadMore) {
      this.setState({ canLoadMore: false });
      transactions(this.props.activePeer, this.props.address, 20, this.props.transactions.length)
      .then((res) => {
        this.props.transactionsLoaded(res.transactions);
        this.setState({
          canLoadMore: parseInt(res.count, 10) > this.props.transactions.length,
          length: parseInt(res.count, 10),
        });
      })
      .catch(error => console.error(error.message)); //eslint-disable-line
    }
  }

  render() {
    return (
      <div className='box'>
        <table className={tableStyle.table}>
          <TransactionsHeader tableStyle={tableStyle}></TransactionsHeader>
          <tbody>
            {this.props.transactions.map(transaction => (
              <TransactionRow address={this.props.address}
                key={transaction.id}
                tableStyle={tableStyle}
                value={transaction}>
              </TransactionRow>
            ))}
          </tbody>
        </table>
        <Waypoint onEnter={() => { this.loadMore(); } }></Waypoint>
      </div>
    );
  }
}

export default Transactions;
