import React from 'react';
import { fromRawLsk } from '../../../../utils/lsk';
import { Button, ActionButton } from '../../../toolbox/buttons/button';
import { authStatePrefill } from '../../../../utils/form';
import Converter from '../../../converter';
import fees from '../../../../constants/fees';
import styles from './form.css';
import regex from '../../../../utils/regex';
import AddressInput from '../../../addressInput';
import ReferenceInput from '../../../referenceInput';
import Bookmark from '../../../bookmark';

class Form extends React.Component {
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
      openFollowedAccountSuggestion: true,
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

  validateInput(name, value, required) { // eslint-disable-line
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

  getMaxAmount() {
    return fromRawLsk(Math.max(0, this.props.account.balance - this.fee));
  }

  handleSetMaxAmount() {
    const amount = parseFloat(this.getMaxAmount());
    this.setState({
      amount: {
        value: amount.toString(),
      },
    });
  }

  focusReference() {
    this.referenceInput.focus();
  }

  handleFocus() {
    this.setState({
      showSetMaxAmount: true,
    });
  }

  handleBlur() {
    /* when click on set max amount link we need a small delay */
    /* to process the click event before hiding */
    setTimeout(() => {
      this.setState({
        showSetMaxAmount: false,
      });
    }, 200);
  }

  render() {
    return (
      <div className={`${styles.sendWrapper}`}>
        <header className={styles.headerWrapper}>
          <h2>{this.props.t('Send LSK')}</h2>
        </header>
        <form className={styles.form}>
          { this.props.followedAccounts.length > 0 && this.state.openFollowedAccountSuggestion ?
            <Bookmark
              focusReference={this.focusReference.bind(this)}
              className='recipient'
              label={this.props.t('Send to address')}
              address={this.state.recipient}
              handleChange={this.handleChange.bind(this, 'recipient', true)}
            /> :
            <AddressInput
              className='recipient'
              label={this.props.t('Send to address')}
              address={this.state.recipient}
              handleChange={this.handleChange.bind(this, 'recipient', true)}
            />
          }
          <ReferenceInput
            context={this}
            label={this.props.t('Reference (optional)')}
            reference={this.state.reference}
            handleChange={this.handleChange.bind(this, 'reference', false)}
          />
          <div className={`amount-wrapper ${styles.amountWrapper}`}>
            <Converter
              label={this.props.t('Amount (LSK)')}
              className='amount'
              theme={styles}
              error={this.state.amount.error}
              value={this.state.amount.value}
              onChange={this.handleChange.bind(this, 'amount', true)}
              onFocus={this.handleFocus.bind(this)}
              onBlur={this.handleBlur.bind(this)}
              t={this.props.t}
            />
            {
              this.state.showSetMaxAmount &&
              !this.state.amount.value &&
              this.getMaxAmount() > 0 ?
                <a onClick={this.handleSetMaxAmount.bind(this)} className={`set-max-amount ${styles.setMaxAmount}`}>{ this.props.t('Set max. amount') }</a>
              : <div></div>
            }
          </div>
        </form>
        <footer>
          <Button
            onClick={() => this.props.goToWallet()}
            className={`send-prev-button ${styles.nextButton}`}
          >
          {this.props.t('Back')}
          </Button>

          <ActionButton
            onClick={() => this.props.nextStep({
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
          >
          {this.props.t('Next')}
          </ActionButton>
        </footer>
      </div>
    );
  }
}

export default Form;
