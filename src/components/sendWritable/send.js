import React from 'react';
import TransferTabs from './../transferTabs';
import { fromRawLsk } from '../../utils/lsk';
import { Button } from './../toolbox/buttons/button';
import { authStatePrefill } from '../../utils/form';
import Converter from '../converter';
import fees from './../../constants/fees';
import styles from './sendWritable.css';
import regex from './../../utils/regex';
import AddressInput from './../addressInput';
import ReferenceInput from './../referenceInput';

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
      reference: {
        value: this.props.reference || '',
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
      const newState = ['recipient', 'amount', 'reference'].reduce((entries, name) => {
        const value = this.props.prevState[name] || this.state[name].value;
        return {
          ...entries,
          [name]: {
            value,
            error: value ? this.validateInput(name, value, true) : undefined,
          },
        };
      }, {});
      this.setState({ ...newState, ...authStatePrefill(this.props.account) });
    }
  }

  handleChange(name, required = true, value, error) {
    this.setState({
      [name]: {
        value,
        error: typeof error === 'string' ? error : this.validateInput(name, value, required),
      },
    });
  }

  validateInput(name, value, required) {
    const byteCount = encodeURI(value).split(/%..|./).length - 1;
    if (!value && required) {
      return this.props.t('Required');
    } else if (name === 'reference' && byteCount > 64) {
      return this.props.t('Maximum length exceeded');
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
          </header>
          <TransferTabs setTabSend={this.props.setTabSend} isActiveTabSend={true}/>
        </div>
        <form className={styles.form}>
          <AddressInput
            className='recipient'
            label={this.props.t('Send to address')}
            address={this.state.recipient}
            handleChange={this.handleChange.bind(this, 'recipient', true)}
          />
          <ReferenceInput
            className='reference'
            label={this.props.t('Reference (optional)')}
            address={this.state.reference}
            handleChange={this.handleChange.bind(this, 'reference', false)}
          />
          <Converter
            label={this.props.t('Amount (LSK)')}
            className='amount'
            theme={styles}
            error={this.state.amount.error}
            value={this.state.amount.value}
            onChange={this.handleChange.bind(this, 'amount', true)}
            t={this.props.t}
          />
        </form>
        <footer>
          <Button onClick={() => this.props.nextStep({
            recipient: this.state.recipient.value,
            amount: this.state.amount.value,
            reference: this.state.reference.value,
          })}
          disabled={(!!this.state.recipient.error ||
                    !this.state.recipient.value ||
                    !!this.state.amount.error ||
                    !!this.state.reference.error ||
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
