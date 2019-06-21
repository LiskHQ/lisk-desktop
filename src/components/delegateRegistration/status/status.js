import React from 'react';
import TransactionResult from '../../transactionResult';
import DelegateAnimation from '../animations/delegateAnimation';
import styles from './status.css';

class Status extends React.Component {
  constructor() {
    super();

    this.state = {
      status: 'pending',
    };

    this.onCheckTransactionStatus = this.onCheckTransactionStatus.bind(this);
    this.onRetry = this.onRetry.bind(this);
  }

  onCheckTransactionStatus() {
    const { status } = this.state;
    const { delegate } = this.props;

    if (delegate.registerStep && delegate.registerStep === 'register-success' && status === 'pending') {
      this.setState({ status: 'ok' });
    }
    if (delegate.registerStep && delegate.registerStep === 'register-failure' && status === 'pending') {
      this.setState({ status: 'fail' });
    }
  }

  onRetry() {
    const { submitDelegateRegistration, userInfo } = this.props;
    this.setState({ status: 'pending' });
    submitDelegateRegistration(userInfo);
  }

  render() {
    const { t, goBackToDelegates } = this.props;
    const { status } = this.state;

    const isTransactionSuccess = status !== 'fail';
    const onSuccess = {
      title: t('Delegate registration submitted'),
      message: t('You will be notified when your transaction is confirmed.'),
      button: {
        onClick: goBackToDelegates,
        title: t('Back to delegates'),
      },
    };

    const onFail = {
      title: t('Delegate registration failed'),
      message: t('Something went wrong with the registration. Please try again below!'),
      button: {
        onClick: this.onRetry,
        title: t('Try again'),
      },
    };

    return (
      <div>
        <TransactionResult
          illustration={<DelegateAnimation
            className={styles.animation}
            status={status}
            onLoopComplete={this.onCheckTransactionStatus} />
          }
          success={isTransactionSuccess}
          title={isTransactionSuccess ? onSuccess.title : onFail.title}
          message={isTransactionSuccess ? onSuccess.message : onFail.message}
          primaryButon={isTransactionSuccess ? onSuccess.button : onFail.button}
          t={t}/>
      </div>
    );
  }
}

export default Status;
