import React from 'react';
import { fromRawLsk } from '../../utils/lsk';
import { Button } from './../toolbox/buttons/button';
import { authStatePrefill } from '../../utils/form';
import AccountVisual from '../accountVisual';
import Input from '../toolbox/inputs/input';
import fees from './../../constants/fees';
import styles from './sendWritable.css';
import regex from './../../utils/regex';
import inputTheme from './input.css';

class SendWritable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipient: {
        value: this.props.address || '',
      },
      amount: {
        value: this.props.amount || '',
      },
      ...authStatePrefill(),
    };
    this.fee = fees.send;
    this.inputValidationRegexps = {
      recipient: regex.address,
      amount: regex.amount,
    };
  }

  componentDidMount() {
    if (this.props.prevState) {
      const newState = {
        recipient: {
          value: this.props.prevState.recipient || this.state.recipient.value,
        },
        amount: {
          value: this.props.prevState.amount || this.state.amount.value,
        },
        ...authStatePrefill(this.props.account),
      };
      this.setState(newState);
    }
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
      return name === 'amount' ? this.props.t('Invalid amount') : this.props.t('Invalid address');
    } else if (name === 'amount' && value > parseFloat(this.getMaxAmount())) {
      return this.props.t('Not enough LSK');
    } else if (name === 'amount' && value === '0') {
      return this.props.t('Zero not allowed');
    }
    return undefined;
  }

  showAccountVisual() {
    return this.state.recipient.value.length && !this.state.recipient.error;
  }

  getMaxAmount() {
    return fromRawLsk(Math.max(0, this.props.account.balance - this.fee));
  }

  render() {
    return (
      <div className={`${styles.sendWrapper}`}>
        <div className={styles.header}>
          <header className={styles.headerWrapper}>
            <h2>{this.props.t('Transfer')}</h2>
            <span className={`${styles.subTitle} ${styles.transfer}`}>{this.props.t('Quickly send and request LSK token')}</span>
          </header>
        </div>
        <form className={styles.form}>
          <Input label={this.props.t('Send to address')}
            className='recipient'
            autoFocus={this.props.autoFocus}
            error={this.state.recipient.error}
            value={this.state.recipient.value}
            onChange={this.handleChange.bind(this, 'recipient')}
            theme={this.showAccountVisual() ? inputTheme : {}}
          >
            {this.showAccountVisual() ?
              <figure className={styles.accountVisual}>
                <AccountVisual address={this.state.recipient.value} size={50} />
              </figure>
              : ''
            }
          </Input>

          <Input label={this.props.t('Amount (LSK)')}
            className='amount'
            error={this.state.amount.error}
            value={this.state.amount.value}
            theme={styles}
            onChange={this.handleChange.bind(this, 'amount')} >
            <div className={styles.fee}> {this.props.t('Fee: {{fee}} LSK', { fee: fromRawLsk(this.fee) })} </div>
          </Input>
        </form>
        <footer>
          <Button onClick={() => this.props.nextStep({
            recipient: this.state.recipient.value,
            amount: this.state.amount.value,
          })}
          disabled={(!!this.state.recipient.error ||
                    !this.state.recipient.value ||
                    !!this.state.amount.error ||
                    !this.state.amount.value)}
          className={`send-next-button ${styles.nextButton}`}
          >{this.props.t('Next')}</Button>
          <div className='subTitle'>{this.props.t('Confirmation in the next step.')}</div>
        </footer>
      </div>
    );
  }
}

export default SendWritable;
