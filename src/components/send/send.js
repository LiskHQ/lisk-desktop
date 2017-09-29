import React from 'react';
import Input from 'react-toolbox/lib/input';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';
import { fromRawLsk, toRawLsk } from '../../utils/lsk';
import AuthInputs from '../authInputs';
import ActionBar from '../actionBar';
import { authStatePrefill, authStateIsValid } from '../../utils/form';

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
      ...authStatePrefill(),
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
      ...authStatePrefill(this.props.account),
    };
    this.setState(newState);
  }

  handleChange(name, value, error) {
    this.setState({
      [name]: {
        value,
        error: typeof error === 'string' ? error : this.validateInput(name, value),
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

  send(event) {
    event.preventDefault();
    this.props.sent({
      activePeer: this.props.activePeer,
      account: this.props.account,
      recipientId: this.state.recipient.value,
      amount: this.state.amount.value,
      passphrase: this.state.passphrase.value,
      secondPassphrase: this.state.secondPassphrase.value,
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
        <form onSubmit={this.send.bind(this)}>
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
          <AuthInputs
            passphrase={this.state.passphrase}
            secondPassphrase={this.state.secondPassphrase}
            onChange={this.handleChange.bind(this)} />
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
              type: 'submit',
              disabled: (
                !!this.state.recipient.error ||
                !this.state.recipient.value ||
                !!this.state.amount.error ||
                !this.state.amount.value ||
                !authStateIsValid(this.state)),
            }} />
        </form>
      </div>
    );
  }
}

export default Send;
