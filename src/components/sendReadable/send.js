import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { fromRawLsk, toRawLsk } from '../../utils/lsk';
import AccountVisual from '../accountVisual';
import { Button, PrimaryButton } from './../toolbox/buttons/button';
import Input from '../toolbox/inputs/input';
import fees from './../../constants/fees';
import styles from './sendReadable.css';

class SendReadable extends React.Component {
  constructor() {
    super();
    this.state = {
      recipient: {
        value: '',
      },
      amount: {
        value: '',
      },
      loading: false,
    };
    this.fee = fees.send;
  }

  componentDidMount() {
    const recipient = this.props.accountInit ? this.props.account.address : this.props.recipient;
    const amount = this.props.accountInit ? 0.1 : this.props.amount;

    const newState = {
      recipient: {
        value: recipient || '',
      },
      amount: {
        value: amount || '',
      },
    };
    this.setState(newState);
  }

  componentDidUpdate() {
    if (this.state.loading &&
      (this.props.pendingTransactions.length > 0 || this.props.failedTransactions)) {
      const data = this.getTransactionState();
      this.props.nextStep(data);
      this.setState({ loading: false });
    }
  }

  getTransactionState() {
    const success = this.props.pendingTransactions.length > 0 && !this.props.failedTransactions;
    const successMessage = this.props.t('Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.');
    const failureMessage = this.props.failedTransactions ? this.props.failedTransactions.errorMessage : '';
    const copy = success ? {
      title: this.props.t('Copy Transaction ID to clipboard'),
      value: this.props.pendingTransactions[0].id,
    } : null;
    return {
      title: success ? this.props.t('Thank you') : this.props.t('Sorry'),
      body: success ? successMessage : failureMessage,
      copy,
      success,
    };
  }

  handleChange(name, value, error) {
    this.setState({
      [name]: {
        value,
        error: typeof error === 'string' ? error : '',
      },
    });
  }

  send(event) {
    event.preventDefault();
    this.setState({ loading: true });
    this.props.sent({
      activePeer: this.props.activePeer,
      account: this.props.account,
      recipientId: this.state.recipient.value,
      amount: this.state.amount.value,
      passphrase: this.props.passphrase.value,
      secondPassphrase: this.props.secondPassphrase.value,
    });
  }

  addAmountAndFee() {
    return fromRawLsk(toRawLsk(this.state.amount.value) + this.fee);
  }

  render() {
    return (
      <div className={`${styles.wrapper} send`}>
        <div className={styles.header}>
          <header className={styles.headerWrapper}>
            <h2>{this.props.accountInit ? this.props.t('Initialize Lisk ID') : this.props.t('Confirm transfer')}</h2>
          </header>
          {this.props.accountInit
            ? null
            : <figure className={styles.accountVisual}>
              <AccountVisual address={this.state.recipient.value} size={150} sizeS={60} />
            </figure>}
        </div>
        {this.props.accountInit
          ? <div>
            <p>{this.props.t('You will send a small amount of 0.1 LSK to yourself and therefore initialize your ID.')}</p>
            <p>{this.props.t('You only need to do this once for each Lisk ID.')}</p>
          </div>
          : <form>
            <Input label={this.props.t('Send to Address')}
              className={`recipient ${styles.disabledInput}`}
              value={this.state.recipient.value}
              onChange={this.handleChange.bind(this, 'recipient')}
              disabled={true}
            />

            <Input label={this.props.t('Total incl. 0.1 LSK Fee')}
              className={`amount ${styles.disabledInput}`}
              error={this.state.amount.error}
              value={this.addAmountAndFee()}
              disabled={true}
              theme={styles}
              onChange={this.handleChange.bind(this, 'amount')} />
          </form>
        }
        <footer>
          <section className={grid.row} >
            <div className={grid['col-xs-4']}>
              <Button
                label={this.props.t('Back')}
                onClick={() => this.props.prevStep({
                  reset: this.props.skipped,
                  recipient: this.props.recipient,
                  amount: this.props.amount,
                }) }
                type='button'
                theme={styles}
              />
            </div>
            <div className={grid['col-xs-8']}>
              <PrimaryButton
                className='send-button'
                label={this.props.accountInit ? this.props.t('Confirm (Fee: 0.1 LSK)') : this.props.t('Send')}
                type='submit'
                theme={styles}
                onClick={this.send.bind(this)}
                disabled={this.state.loading}
              />
              <div className='subTitle'>{this.props.t('Transactions can’t be reversed')}</div>
            </div>
          </section>
        </footer>
      </div>
    );
  }
}

export default SendReadable;
