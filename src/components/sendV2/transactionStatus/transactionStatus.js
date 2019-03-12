import React from 'react';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../../toolbox/buttons/button';
import Piwik from '../../../utils/piwik';
import statusMessage from './statusMessages';
import styles from './transactionStatus.css';

class TransactionStatus extends React.Component {
  constructor(props) {
    super(props);

    this.backToWallet = this.backToWallet.bind(this);
    this.onErrorReport = this.onErrorReport.bind(this);
    this.onPrevStep = this.onPrevStep.bind(this);
  }

  backToWallet() {
    Piwik.trackingEvent('TransactionStatus', 'button', 'Back to wallet');
    // istanbul ignore else
    if (this.props.failedTransactions !== undefined) this.props.transactionFailedClear();
    this.props.finalCallback();
  }

  // eslint-disable-next-line class-methods-use-this
  onErrorReport() {
    const recipient = 'hubdev@lisk.io';
    const subject = `User Reported Error - Lisk Hub - ${VERSION}`; // eslint-disable-line no-undef
    return `mailto:${recipient}?&subject=${subject}`;
  }

  onPrevStep() {
    this.props.transactionFailedClear();
    this.props.prevStep({ fields: { ...this.props.fields } });
  }

  render() {
    const isTransactionSuccess = this.props.failedTransactions === undefined;
    const hwTransactionError = this.props.fields.isHardwareWalletConnected && this.props.fields.hwTransactionStatus === 'error';
    const messages = statusMessage(this.props.t);
    let transactionStatus = isTransactionSuccess ? messages.success : messages.error;

    // istanbul ignore else
    if (this.props.fields.isHardwareWalletConnected) {
      transactionStatus = hwTransactionError ? messages.hw : messages.success;
    }

    return (
      <div className={`${styles.wrapper} transaction-status`}>
        <header className={styles.header}>
          <img src={transactionStatus.headerIcon}/>
        </header>
        <div className={`${styles.content} transaction-status-content`}>
          <h1>{transactionStatus.bodyText.title}</h1>
          <p>{transactionStatus.bodyText.paragraph}</p>
        </div>
        <footer className={`${styles.footer} transaction-status-footer`}>
          <div>
            {
              hwTransactionError
              ? (<SecondaryButtonV2
                  label={this.props.t('Retry')}
                  className={`${styles.btn} retry`}
                  onClick={() => this.onPrevStep()}
                />)
              : null
            }
            <PrimaryButtonV2 className={`${styles.btn} on-goToWallet okay-button`} onClick={this.backToWallet}>{this.props.t('Back to wallet')}</PrimaryButtonV2>
          </div>
          {
            !isTransactionSuccess
            ? <div className={`${styles.errorReport} transaction-status-error`}>
                <span>{this.props.t('Does the problem still persist?')}</span>
                <a
                  href={this.onErrorReport()}
                  target='_top'
                  rel='noopener noreferrer'>
                {this.props.t('Report the error via E-Mail')}
                </a>
              </div>
            : null
          }
        </footer>
      </div>
    );
  }
}

export default TransactionStatus;
