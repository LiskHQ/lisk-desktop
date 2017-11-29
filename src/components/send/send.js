import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { fromRawLsk, toRawLsk } from '../../utils/lsk';
import AuthInputs from '../authInputs';
import { Button, PrimaryButton } from './../toolbox/buttons/button';
import { authStatePrefill, authStateIsValid } from '../../utils/form';
import Input from '../toolbox/inputs/input';

import styles from './send.css';
import inputTheme from './input.css';

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

  showAvatar() {
    return this.state.recipient.value.length
      && !this.state.recipient.error
      && this.props.isEditable;
  }

  getMaxAmount() {
    return fromRawLsk(Math.max(0, this.props.account.balance - toRawLsk(this.fee)));
  }

  setMaxAmount() {
    this.handleChange('amount', this.getMaxAmount());
  }

  render() {
    return (
      <div className={`${styles.send} boxPadding send`}>
        <form onSubmit={this.send.bind(this)}>
          {this.showAvatar()
            ? <img className={styles.smallAvatar}></img>
            : ''
          }
          <Input label={this.props.t('Send to Address')}
            className='recipient'
            autoFocus={true}
            error={this.state.recipient.error}
            value={this.state.recipient.value}
            onChange={this.handleChange.bind(this, 'recipient')}
            readOnly={!this.props.isEditable}
            theme={this.showAvatar() ? inputTheme : {}}
          />

          {this.props.isEditable
            ?
            <div style={{ height: '150px' }}>
              <Input label={this.props.t('Amount (LSK)')}
                className='amount'
                error={this.state.amount.error}
                value={this.state.amount.value}
                theme={styles}
                onChange={this.handleChange.bind(this, 'amount')} />
              <div className={styles.fee}> {this.props.t('Fee: {{fee}} LSK', { fee: this.fee })} </div>
            </div>
            :
            <div style={{ height: '150px' }}>
              <Input label={this.props.t('Total incl. 0.1 LSK Fee')}
                className='amount'
                error={this.state.amount.error}
                value={this.state.amount.value + this.fee}
                readOnly='true'
                theme={styles}
                onChange={this.handleChange.bind(this, 'amount')} />
              <AuthInputs
                passphrase={this.state.passphrase}
                secondPassphrase={this.state.secondPassphrase}
                onChange={this.handleChange.bind(this)}
              />
            </div>
          }
          <div className={styles.actionSection}>
            {this.props.isEditable
              ?
              <div>
                <Button onClick={this.props.next}
                  disabled={(!!this.state.recipient.error ||
                          !this.state.recipient.value ||
                          !!this.state.amount.error ||
                          !this.state.amount.value)}
                >Next</Button>
                <div className={styles.subTitle}>Confirmation in the next step.</div>
              </div>
              :
              <section className={grid.row} >
                <div className={grid['col-xs-4']}>
                  <Button
                    label={this.props.t('Cancel')}
                    onClick={this.props.back}
                    type='button'
                    theme={styles}
                  />
                </div>
                <div className={grid['col-xs-8']}>
                  <PrimaryButton
                    label={this.props.t('Send')}
                    type='submit'
                    theme={styles}
                    disabled={!authStateIsValid(this.state)}
                  />
                  <div className={styles.subTitle}>Transactions can’t be reversed.</div>
                </div>
              </section>
            }
          </div>
        </form>
      </div>
    );
  }
}

export default Send;
