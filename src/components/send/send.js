import React from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';

import { send } from '../../utils/api/account';
import { fromRawLsk, toRawLsk } from '../../utils/lsk';

import styles from './send.css';
import grid from '../../../node_modules/flexboxgrid/dist/flexboxgrid.css';

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
    const newState = this.state;
    newState[name].value = value;
    this.setState(this.validate(newState));
  }

  // eslint-disable-next-line class-methods-use-this
  validate(state) {
    state.amount.error = undefined;
    state.recipient.error = undefined;
    if (!state.amount.value) {
      state.amount.error = 'Required';
    } else if (!state.amount.value.match(/^\d+(\.\d{1,8})?$/)) {
      state.amount.error = 'Invalid LSK amount';
    } else if (state.amount.value > parseFloat(this.getMaxAmount())) {
      state.amount.error = 'Insufficient funds';
    }

    if (!state.recipient.value) {
      state.recipient.error = 'Required';
    } else if (!state.recipient.value.match(/^\d{1,21}[L|l]$/)) {
      state.recipient.error = 'Invalid address';
    }
    return state;
  }

  send() {
    send(this.props.activePeer,
      this.state.recipient.value,
      toRawLsk(this.state.amount.value),
      this.props.account.passphrase,
      this.props.account.sencodPassphrase,
    ).then(() => {
      // TODO implement and use our custom alert dialogs
      // eslint-disable-next-line no-alert
      alert(`Your transaction of ${this.state.amount.value} LSK to ${this.state.recipient.value} was accepted and will be processed in a few seconds.`);
      this.props.closeDialog();
    }).catch((res) => {
      // TODO implement and use our custom alert dialogs
      // eslint-disable-next-line no-alert
      alert(res && res.message ? res.message : 'An error occurred while creating the transaction.');
    });
  }

  getMaxAmount() {
    return fromRawLsk(this.props.account.balance - toRawLsk(this.fee));
  }

  setMaxAmount() {
    const newState = this.state;
    newState.amount.value = this.getMaxAmount();
    this.setState(newState);
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
        <section className={`${grid.row} ${grid['between-xs']}`}>
          <Button label='Cancel' className='cancel-button' onClick={this.props.closeDialog} />
          <Button label='Send'
            className='send-button'
            primary={true} raised={true}
            disabled={!!this.state.recipient.error || !!this.state.amount.error ||
              !this.state.recipient.value || !this.state.amount.value}
            onClick={this.send.bind(this)}/>
        </section>
      </div>
    );
  }
}

export default Send;
