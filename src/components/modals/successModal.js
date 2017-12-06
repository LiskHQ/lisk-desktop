import React from 'react';
import { Button } from '../toolbox/buttons/button';
import styles from '../sendWritable/send.css';
import copy from '../../assets/images/icons/copy.svg';

class SuccessModal extends React.Component {
  constructor() {
    super();
    this.transactions = [];
  }

  componentDidUpdate() {
    if (this.props.pendingTransactions.length > 0) {
      this.transactions.push(this.props.pendingTransactions[0]);
    }
  }

  copyTransactionID() {
    this.props.copyToClipboard(this.transactions[0].id);
  }

  render() {
    return (
      <div className={`${styles.modal} boxPadding`}>
        <div className={styles.header}>
          <i className={`${styles.temporarySuccessCheck} material-icons`}>check</i>
        </div>
        <header>
          <h2>{this.props.t('Thank you')}</h2>
        </header>
        <p className='success-message'>
          {this.props.t('Transaction is being processed and will be confirmed. ' +
            'It may take up to 15 minutes to be secured in the blockchain.')}
        </p>

        <div onClick={this.copyTransactionID.bind(this)} className={`${styles.copy}`}>
          <img src={copy} /> <span>{this.props.t('Copy Transaction-ID to clipboard')}</span>
        </div>

        <footer>
          <Button className='okay-button' onClick={() => this.props.prevStep({ reset: true })}>{this.props.t('Okay')}</Button>
          <div className='subTitle'></div>
        </footer>
      </div>

    );
  }
}

export default SuccessModal;
