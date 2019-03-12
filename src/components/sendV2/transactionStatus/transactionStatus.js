import React from 'react';
import { PrimaryButtonV2 } from '../../toolbox/buttons/button';
import Piwik from '../../../utils/piwik';
import svg from '../../../utils/svgIcons';
import styles from './transactionStatus.css';

class TransactionStatus extends React.Component {
  constructor(props) {
    super(props);

    this.backToWallet = this.backToWallet.bind(this);
    this.onErrorReport = this.onErrorReport.bind(this);
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

  render() {
    const isTransactionSuccess = this.props.failedTransactions === undefined;

    let transactionStatus = {
      headerIcon: svg.transactionSuccess,
      bodyText: {
        title: 'Transaction submitted',
        paragraph: 'You will find it in My Transactions in a matter of minutes',
      },
    };

    // istanbul ignore else
    if (!isTransactionSuccess) {
      transactionStatus = {
        headerIcon: svg.transactionError,
        bodyText: {
          title: 'Transaction failed',
          paragraph: 'Oops, looks like something went wrong. Please try again.',
        },
      };
    }

    return (
      <div className={`${styles.wrapper} transaction-status`}>
        <header className={styles.header}>
          <img src={transactionStatus.headerIcon}/>
        </header>
        <div className={`${styles.content} transaction-status-content`}>
          <h1>{this.props.t('{{title}}', { title: transactionStatus.bodyText.title })}</h1>
          <p>{this.props.t('{{paragraph}}', { paragraph: transactionStatus.bodyText.paragraph })}</p>
        </div>
        <footer className={`${styles.footer} transaction-status-footer`}>
          <PrimaryButtonV2 className={'on-goToWallet'} onClick={this.backToWallet}>{this.props.t('Back to wallet')}</PrimaryButtonV2>
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
