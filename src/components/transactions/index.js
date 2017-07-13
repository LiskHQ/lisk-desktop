import React from 'react';
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
    };
  }

  // const transaction = {
  //   id: '8650097545654773965',
  //   height: 12248,
  //   blockId: '1288793478441806835',
  //   type: 0,
  //   timestamp: 35326451,
  //   senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
  //   senderId: '16313739661670634666L',
  //   recipientId: '4264113712245538326L',
  //   recipientPublicKey: null,
  //   amount: 500000000000,
  //   fee: 10000000,
  //   signatures: [],
  //   confirmations: 7025,
  //   asset: {},
  // };
  componentDidMount() {
    console.log(this.state);
    transactions(this.props.activePeer, this.props.address, 40, this.state.offset).then((res) => {
      const list = res.transactions.map(transaction => (
        <TransactionRow address={this.props.address}
          key={transaction.id}
          tableStyle={tableStyle}
          value={transaction}>
        </TransactionRow>
      ));
      this.setState({
        transactions: list,
        offset: this.state.offset + 20,
      });
    });
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
      </div>
    );
  }
}

export default Transactions;

