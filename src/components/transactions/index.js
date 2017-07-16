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
      transactions: [],
      offset: 0,
      loadMore: true,
      length: 1,
    };
  }

  componentDidMount() {
    this.loadMore();
  }

  loadMore() {
    if (this.state.loadMore && this.state.length > this.state.offset) {
      this.setState({ loadMore: false });
      transactions(this.props.activePeer, this.props.address, 20, this.state.offset)
      .then((res) => {
        const list = res.transactions.map(transaction => (
          <TransactionRow address={this.props.address}
            key={transaction.id}
            tableStyle={tableStyle}
            value={transaction}>
          </TransactionRow>
        ));
        this.setState({
          transactions: this.state.transactions.concat(list),
          offset: this.state.offset + 20,
          loadMore: true,
          length: parseInt(res.count, 10),
        });
      })
      .catch(error => console.error(error.message));
    }
  }

  render() {
    return (
      <div className='box'>
        <table className={tableStyle.table}>
          <TransactionsHeader tableStyle={tableStyle}></TransactionsHeader>
          <tbody>
            {this.state.transactions}
          </tbody>
        </table>
        <Waypoint onEnter={() => { this.loadMore(); } }></Waypoint>
      </div>
    );
  }
}

export default Transactions;

