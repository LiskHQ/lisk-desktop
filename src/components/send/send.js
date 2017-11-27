import React from 'react';
import { fromRawLsk, toRawLsk } from '../../utils/lsk';
import AuthInputs from '../authInputs';
import ActionBar from '../actionBar';
import { Button } from './../toolbox/buttons/button';
import { authStatePrefill, authStateIsValid } from '../../utils/form';
import Input from '../toolbox/inputs/input';

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
      tabs: {
        active: 'send',
      },
      isEditable: true,
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
      return this.props.t('Required');
    } else if (!value.match(this.inputValidationRegexps[name])) {
      return this.props.t('Invalid');
    } else if (name === 'amount' && value > parseFloat(this.getMaxAmount())) {
      return this.props.t('Insufficient funds');
    } else if (name === 'amount' && value === '0') {
      return this.props.t('Zero not allowed');
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

  next() {
    this.setState({ isEditable: false });
  }

  back() {
    this.setState({ isEditable: true });
  }

  render() {
    return (
      <div className={`${styles.send} send`}>
        <form onSubmit={this.send.bind(this)}>
          <Input label={this.props.t('Send to Address')} required={true}
            className='recipient'
            autoFocus={true}
            error={this.state.recipient.error}
            value={this.state.recipient.value}
            onChange={this.handleChange.bind(this, 'recipient')}
            readOnly={!this.state.isEditable}
          />
          <Input label={this.props.t('Amount (LSK)')} required={true}
            className='amount'
            error={this.state.amount.error}
            value={this.state.amount.value}
            readOnly={!this.state.isEditable}
            onChange={this.handleChange.bind(this, 'amount')} />
          <AuthInputs
            passphrase={this.state.passphrase}
            secondPassphrase={this.state.secondPassphrase}
            onChange={this.handleChange.bind(this)} />
          <div className={styles.fee}> {this.props.t('Fee: {{fee}} LSK', { fee: this.fee })} </div>
          <div className={styles.actionSection}>
            {this.state.isEditable
              ?
              <Button onClick={this.next.bind(this)}>Next</Button>
              :
              <ActionBar
                secondaryButton={{
                  onClick: this.back.bind(this),
                }}
                primaryButton={{
                  label: this.props.t('Send'),
                  type: 'submit',
                  disabled: (!!this.state.recipient.error ||
                            !this.state.recipient.value ||
                            !!this.state.amount.error ||
                            !this.state.amount.value ||
                            !authStateIsValid(this.state)),
                }} />
            }
          </div>
        </form>
      </div>
    );
  }
}

export default Send;
