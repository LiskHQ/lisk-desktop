import React from 'react';
import { fromRawLsk, toRawLsk } from '../../../../utils/lsk';
import AccountVisual from '../../../accountVisual';
import { Button, PrimaryButton } from './../../../toolbox/buttons/button';
import ToolBoxInput from '../../../toolbox/inputs/toolBoxInput';
import fees from './../../../../constants/fees';
import styles from './confirm.css';

class Confirm extends React.Component {
  constructor() {
    super();
    this.state = {
      recipient: {
        value: '',
      },
      amount: {
        value: '',
      },
      reference: {
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
      reference: {
        value: this.props.reference || '',
      },
    };
    this.setState(newState);
  }

  componentDidUpdate() {
    // Hardware wallet code preventing by going on last step when there is pending transaction
    const pending = this.props.account.hwInfo && this.props.account.hwInfo.deviceId
      ? this.props.pendingTransactions.find(transaction => (
        transaction.senderId === this.props.account.address &&
      transaction.recipientId === this.state.recipient.value &&
      fromRawLsk(transaction.amount) === this.props.amount
      )) : this.props.pendingTransactions.length;

    if (this.state.loading && (pending || this.props.failedTransactions)) {
      const data = this.getTransactionState();
      this.props.nextStep({
        ...data,
        amount: this.props.amount,
        account: this.props.account,
        recipientId: this.state.recipient.value,
      });
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
      account: this.props.account,
      recipientId: this.state.recipient.value,
      amount: this.state.amount.value,
      passphrase: this.props.passphrase.value,
      secondPassphrase: this.props.secondPassphrase.value,
      data: this.props.accountInit ? this.props.t('Account initialization') : this.props.reference,
    });
  }

  addAmountAndFee() {
    return fromRawLsk(toRawLsk(this.state.amount.value) + this.fee);
  }

  render() {
    // eslint-disable-next-line
    const title = this.props.accountInit ?
      this.props.t('Initialize Lisk ID') :
      (this.props.account.hwInfo && this.props.account.hwInfo.deviceId ? this.props.t('Confirm transaction on Ledger Nano S') : this.props.t('Confirm transfer'));
    const followedAccount = this.props.followedAccounts
      .find(account => account.address === this.state.recipient.value);

    return (
      <div className={`${styles.wrapper} send`}>
        <div className={styles.header}>
          <header className={styles.headerWrapper}>
            <h2 className='title'>{title}</h2>
          </header>
        </div>
        {this.props.accountInit
          ? <div>
            <p>{this.props.t('You will send a small amount of {{fee}} LSK to yourself and therefore initialize your ID.', { fee: fromRawLsk(fees.send) })}</p>
            <p>{this.props.t('You only need to do this once for each Lisk ID.')}</p>
          </div>
          : <form>
            <ToolBoxInput
              label={this.props.t('Send to Address')}
              className={`recipient ${styles.disabledInput}`}
              // value={this.state.recipient.value}
              onChange={this.handleChange.bind(this, 'recipient')}
              disabled={true}
            >
              <div className={styles.recepientRow}>
                <AccountVisual
                  className={styles.accountVisual}
                  address={this.state.recipient.value}
                  size={40}
                />
                <div className={styles.text}>
                  <div className={styles.title}>{followedAccount && followedAccount.title}</div>
                  <div className={`${followedAccount && followedAccount.title ? styles.smallAddress : styles.address}`}>
                    {this.state.recipient.value}
                  </div>
                </div>
              </div>
            </ToolBoxInput>
            {this.state.reference.value ?
              <ToolBoxInput label={this.props.t('Reference')}
                className={`reference ${styles.disabledInput}`}
                error={this.state.reference.error}
                value={this.state.reference.value}
                disabled={true}
                multiline={true}
                theme={styles}
              /> :
              <ToolBoxInput label={this.props.t('Reference')}
                className={`reference ${styles.disabledInput}`}
                error={this.state.reference.error}
                value={'-'}
                disabled={true}
                multiline={true}
                theme={styles}
              />
            }
            <ToolBoxInput label={this.props.t('Total incl. {{fee}} LSK Fee', { fee: fromRawLsk(fees.send) })}
              className={`amount ${styles.disabledInput}`}
              error={this.state.amount.error}
              value={this.addAmountAndFee()}
              disabled={true}
              theme={styles}
              onChange={this.handleChange.bind(this, 'amount')} />
          </form>
        }
        <footer>
          <section>
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
              <PrimaryButton
                className='send-button'
                label={this.props.accountInit ? this.props.t('Confirm (Fee: {{fee}} LSK)', { fee: fromRawLsk(fees.send) }) : this.props.t('Send')}
                type='submit'
                theme={styles}
                onClick={this.send.bind(this)}
                disabled={this.state.loading}
              />
          </section>
          <div className='subTitle'>{this.props.t('Transactions can’t be reversed')}</div>
        </footer>
      </div>
    );
  }
}

export default Confirm;
