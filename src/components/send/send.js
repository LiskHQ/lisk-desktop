import React from 'react';
import Input from 'react-toolbox/lib/input';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';

import { send } from '../../utils/api/account';
import { fromRawLsk, toRawLsk } from '../../utils/lsk';
import ActionBar from '../actionBar';

import styles from './send.css';

class Send extends React.Component {
  constructor() {
    super();
    this.state = {
      recipient: {
        value: '',
      },
      amount: {
        value: '',
      },
    };
    this.fee = 0.1;
    this.inputValidationRegexps = {
      recipient: /^\d{1,21}[L|l]$/,
      amount: /^\d+(\.\d{1,8})?$/,
    };
  }

  componentDidMount() {
    const newState = {
      recipient: {
        value: this.props.recipient || '',
      },
      amount: {
        value: this.props.amount || '',
      },
    };
    this.setState(newState);
  }

  handleChange(name, value) {
    this.setState({
      [name]: {
        value,
        error: this.validateInput(name, value),
      },
    });
  }

  validateInput(name, value) {
    if (!value) {
      return 'Required';
    } else if (!value.match(this.inputValidationRegexps[name])) {
      return 'Invalid';
    } else if (name === 'amount' && value > parseFloat(this.getMaxAmount())) {
      return 'Insufficient funds';
    } else if (name === 'amount' && value === '0') {
      return 'Zero not allowed';
    }
    return undefined;
  }

  send() {
    send(this.props.activePeer,
      this.state.recipient.value,
      toRawLsk(this.state.amount.value),
      this.props.account.passphrase,
      this.props.account.sencodPassphrase,
    ).then((data) => {
      this.props.showSuccessAlert({
        text: `Your transaction of ${this.state.amount.value} LSK to ${this.state.recipient.value} was accepted and will be processed in a few seconds.`,
      });
      this.props.addTransaction({
        id: data.transactionId,
        senderPublicKey: this.props.account.publicKey,
        senderId: this.props.account.address,
        recipientId: this.state.recipient.value,
        amount: toRawLsk(this.state.amount.value),
        fee: toRawLsk(this.fee),
      });
    }).catch((res) => {
      this.props.showErrorAlert({
        text: res && res.message ? res.message : 'An error occurred while creating the transaction.',
      });
    });
  }

  getMaxAmount() {
    return fromRawLsk(Math.max(0, this.props.account.balance - toRawLsk(this.fee)));
  }

  setMaxAmount() {
    this.handleChange('amount', this.getMaxAmount());
  }

  render() {
    return (
      <div className={`${styles.send} send`}>
        <Input label='Recipient Address' required={true}
          className='recipient'
          autoFocus={true}
          error={this.state.recipient.error}
          value={this.state.recipient.value}
          onChange={this.handleChange.bind(this, 'recipient')} />
        <Input label='Transaction Amount' required={true}
          className='amount'
          error={this.state.amount.error}
          value={this.state.amount.value}
          onChange={this.handleChange.bind(this, 'amount')} />
        <div className={styles.fee}> Fee: {this.fee} LSK</div>
        <IconMenu icon='more_vert' position='topRight' menuRipple className={`${styles.sendAllMenu} transaction-amount`} >
          <MenuItem onClick={this.setMaxAmount.bind(this)}
            caption='Set maximum amount'
            className='send-maximum-amount'/>
        </IconMenu>
        <ActionBar
          secondaryButton={{
            onClick: this.props.closeDialog,
          }}
          primaryButton={{
            label: 'Send',
            disabled: (
              !!this.state.recipient.error ||
              !!this.state.amount.error ||
              !this.state.recipient.value ||
              !this.state.amount.value),
            onClick: this.send.bind(this),
          }} />
      </div>
    );
  }
}

export default Send;
