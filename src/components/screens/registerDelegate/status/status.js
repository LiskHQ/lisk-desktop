import React from 'react';
import { TransactionResult } from '@shared/transactionResult';
import { transactionToJSON } from '@utils/transaction';
import DelegateAnimation from '../animations/delegateAnimation';
import statusMessages from './statusMessages';
import styles from './status.css';

class Status extends React.Component {
  constructor() {
    super();

    this.state = {
      status: 'pending',
    };

    this.checkTransactionStatus = this.checkTransactionStatus.bind(this);
  }

  componentDidMount() {
    const { transactionInfo } = this.props;
    // istanbul ignore else
    if (transactionInfo) this.broadcastTransaction();
  }

  broadcastTransaction() {
    const { transactionBroadcasted, transactionInfo } = this.props;
    transactionBroadcasted(transactionInfo);
  }

  // TODO update test coverage in PR #2199
  // istanbul ignore next
  checkTransactionStatus() {
    const { transactions, transactionInfo } = this.props;
    const transaction = JSON.parse(transactionToJSON(transactionInfo));

    const success = transactions.confirmed
      .filter(tx => tx.id === transaction.id);

    if (success.length) this.setState({ status: 'success' });
    if (transactions.txBroadcastError) this.setState({ status: 'error' });
  }

  render() {
    const { t } = this.props;
    const { status } = this.state;
    const template = statusMessages(t)[status];

    return (
      <div className={`${styles.wrapper} status-container`}>
        <TransactionResult
          illustration={(
            <DelegateAnimation
              className={styles.animation}
              status={status}
              onLoopComplete={this.checkTransactionStatus}
            />
          )}
          status={{ code: status }}
          title={template.title}
          message={template.message}
          className={styles.content}
          t={t}
        />
      </div>
    );
  }
}

export default Status;
