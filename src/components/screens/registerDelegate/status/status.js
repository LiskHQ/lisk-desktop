import React from 'react';
import TransactionResult from '@shared/transactionResult';
import DialogHolder from '@toolbox/dialog/holder';
import { transactionToJSON } from '@utils/transaction';
import DelegateAnimation from '../animations/delegateAnimation';
import styles from './status.css';

class Status extends React.Component {
  constructor() {
    super();

    this.state = {
      status: 'pending',
    };

    this.onRetry = this.onRetry.bind(this);
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

    if (success.length) this.setState({ status: 'ok' });
    if (transactions.txBroadcastError) this.setState({ status: 'fail' });
  }

  // TODO update test coverage in PR #2199
  // istanbul ignore next
  onRetry() {
    this.setState({ status: 'pending' });
    this.broadcastTransaction();
  }

  render() {
    const { t } = this.props;
    const { status } = this.state;

    const isTransactionSuccess = status !== 'fail';

    // TODO update test coverage in PR #2199
    // istanbul ignore next
    const displayTemplate = isTransactionSuccess
      ? {
        title: t('Delegate registration submitted'),
        message: t('You will be notified when your transaction is confirmed.'),
        button: {
          onClick: DialogHolder.hideDialog,
          title: t('Close'),
          className: 'close-modal',
        },
      }
      : {
        title: t('Delegate registration failed'),
        message: t('Something went wrong with the registration. Please try again below!'),
        button: {
          onClick: this.onRetry,
          title: t('Try again'),
          className: 'on-retry',
        },
      };

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
          success={isTransactionSuccess}
          title={displayTemplate.title}
          message={displayTemplate.message}
          primaryButton={displayTemplate.button}
          className={styles.content}
          t={t}
        />
      </div>
    );
  }
}

export default Status;
