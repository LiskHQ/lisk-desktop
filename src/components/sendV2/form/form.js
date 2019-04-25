// eslint-disable-line max-lines
import React from 'react';
import ConverterV2 from '../../converterV2';
import { PrimaryButtonV2 } from '../../toolbox/buttons/button';
import { InputV2, AutoresizeTextarea } from '../../toolbox/inputsV2';
import Bookmark from '../../bookmarkV2';
import regex from '../../../utils/regex';
import SpinnerV2 from '../../spinnerV2/spinnerV2';
import svg from '../../../utils/svgIcons';
import Tooltip from '../../toolbox/tooltip/tooltip';
import links from '../../../constants/externalLinks';
import { fromRawLsk } from '../../../utils/lsk';
import fees from '../../../constants/fees';
import Feedback from '../../toolbox/feedback/feedback';
import CircularProgress from '../../toolbox/circularProgress/circularProgress';
import styles from './form.css';
import Piwik from '../../../utils/piwik';

class Form extends React.Component {
  // eslint-disable-next-line max-statements
  constructor(props) {
    super(props);

    this.state = {
      isAmountLoading: false,
      isReferenceLoading: false,
      fields: {
        recipient: {
          address: '',
          balance: '',
          error: false,
          feedback: '',
          name: 'recipient',
          selected: false,
          title: '',
          value: '',
          showSuggestions: false,
          following: false,
        },
        amount: {
          error: false,
          value: '',
          feedback: '',
        },
        reference: {
          error: false,
          value: '',
          feedback: props.t('64 bytes left'),
          isActive: false,
        },
      },
    };

    this.loaderTimeout = null;

    this.getMaxAmount = this.getMaxAmount.bind(this);
    this.ifDataFromPrevState = this.ifDataFromPrevState.bind(this);
    this.ifDataFromUrl = this.ifDataFromUrl.bind(this);
    this.onAmountOrReferenceChange = this.onAmountOrReferenceChange.bind(this);
    this.onGoNext = this.onGoNext.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onSelectedAccount = this.onSelectedAccount.bind(this);
    this.validateAmountAndReference = this.validateAmountAndReference.bind(this);
    this.validateBookmark = this.validateBookmark.bind(this);
    this.checkIfBoormakedAccount = this.checkIfBoormakedAccount.bind(this);
    this.setReferenceActive = this.setReferenceActive.bind(this);
  }

  componentDidMount() {
    this.checkIfBoormakedAccount();
    if (!Object.entries(this.props.prevState).length) this.ifDataFromUrl();
    if (Object.entries(this.props.prevState).length) this.ifDataFromPrevState();
  }

  ifDataFromPrevState() {
    const { prevState } = this.props;
    if (prevState.fields && Object.entries(prevState.fields).length) {
      this.setState({
        fields: {
          ...prevState.fields,
        },
      });
    }
  }

  ifDataFromUrl() {
    const { fields = {} } = this.props;
    if (fields.recipient.address !== '' || fields.amount.value !== '' || fields.reference.value !== '') {
      this.setState(prevState => ({
        fields: {
          ...prevState.fields,
          recipient: {
            ...prevState.fields.recipient,
            address: fields.recipient.address,
            value: fields.recipient.address,
          },
          amount: {
            ...prevState.fields.amount,
            value: fields.amount.value,
          },
          reference: {
            ...prevState.fields.reference,
            value: fields.reference.value,
          },
        },
      }));
    }
  }

  checkIfBoormakedAccount() {
    const { followedAccounts, fields } = this.props;
    const account = followedAccounts.length
      ? followedAccounts.find(acc => acc.address === fields.recipient.address)
      : false;

    if (account) this.onSelectedAccount(account);
  }

  onInputChange({ target }) {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [target.name]: {
          ...prevState.fields[target.name],
          value: target.value,
        },
      },
    }));
  }

  // eslint-disable-next-line max-statements
  validateBookmark() {
    const { followedAccounts } = this.props;
    let recipient = this.state.fields.recipient;
    let isAccountValid = '';
    let isAddressValid = '';

    if (followedAccounts.length && recipient.value !== '') {
      isAccountValid = followedAccounts
        .find(account => (account.title.toLowerCase() === recipient.value.toLowerCase()) ||
          account.address.toLowerCase() === recipient.value.toLowerCase()) || false;
      isAddressValid = regex.address.test(recipient.value);
    } else {
      isAddressValid = recipient.value.match(regex.address);
    }

    // istanbul ignore else
    if (!isAccountValid && !isAddressValid && recipient.value) {
      recipient = {
        ...this.state.recipient,
        address: '',
        balance: '',
        error: true,
        feedback: 'Provide a correct wallet address or a name of a bookmarked account',
        selected: false,
        title: '',
        showSuggestions: true,
      };
    }

    // istanbul ignore else
    if (isAddressValid) {
      recipient = {
        ...this.state.recipient,
        address: recipient.value,
        selected: false,
        error: false,
        feedback: '',
        showSuggestions: false,
        following: false,
      };
    }

    // istanbul ignore else
    if (isAccountValid) {
      recipient = {
        ...this.state.recipient,
        address: isAccountValid.address,
        title: isAccountValid.title,
        balance: isAccountValid.balance,
        selected: true,
        error: false,
        feedback: '',
        showSuggestions: false,
        following: true,
      };
    }

    // istanbul ignore else
    if (recipient.value === '') {
      recipient = {
        ...this.state.recipient,
        address: '',
        balance: '',
        error: false,
        feedback: '',
        selected: false,
        title: '',
        showSuggestions: true,
      };
    }

    this.setState({
      fields: {
        ...this.state.fields,
        recipient: {
          ...this.state.fields.recipient,
          ...recipient,
        },
      },
    });
  }

  onSelectedAccount(account) {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        recipient: {
          ...this.state.fields.recipient,
          ...account,
          value: account.address,
          selected: true,
          error: '',
          feedback: '',
          showSuggestions: false,
          following: true,
        },
      },
    }));
  }

  getMaxAmount() {
    return fromRawLsk(Math.max(0, this.props.account.balance - fees.send));
  }

  validateAmountField(value) {
    if (/^0.(0|[a-zA-z])*$/g.test(value)) return this.props.t('Provide a correct amount of LSK');
    if (/([^\d.])/g.test(value)) return this.props.t('Provide a correct amount of LSK');
    if ((/(\.)(.*\1){1}/g.test(value) || /\.$/.test(value)) || value === '0') return this.props.t('Invalid amount');
    if (parseFloat(this.getMaxAmount()) < value) return this.props.t('Provided amount is higher than your current balance.');
    return false;
  }

  // eslint-disable-next-line max-statements
  validateAmountAndReference(name, value) {
    const { t } = this.props;
    const messageMaxLength = 64;
    let feedback = '';
    let error = '';

    // istanbul ignore else
    if (name === 'amount') {
      value = /^\./.test(value) ? `0${value}` : value;
      error = this.validateAmountField(value);
      feedback = error || feedback;
    }

    // istanbul ignore else
    if (name === 'reference') {
      const byteCount = encodeURI(value).split(/%..|./).length - 1;
      error = byteCount > messageMaxLength;
      feedback = t('{{length}} bytes left', { length: messageMaxLength - byteCount });
    }

    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: {
          ...prevState.fields[name],
          error: !!error,
          value,
          feedback,
        },
      },
    }));
  }

  onAmountOrReferenceChange({ target }) {
    clearTimeout(this.loaderTimeout);

    if (target.name === 'amount') {
      this.setState({ isAmountLoading: true });
      this.loaderTimeout = setTimeout(() => {
        this.setState({ isAmountLoading: false });
        this.validateAmountAndReference(target.name, target.value);
      }, 300);
    }

    if (target.name === 'reference') {
      this.validateAmountAndReference(target.name, target.value);
    }

    this.onInputChange({ target });
  }

  // istanbul ignore next
  onGoNext() {
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    this.props.nextStep({
      fields: { ...this.state.fields },
    });
  }

  setReferenceActive(isActive) {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        reference: {
          ...prevState.fields.reference,
          isActive,
        },
      },
    }));
  }

  // eslint-disable-next-line complexity
  render() {
    const { fields } = this.state;
    const messageMaxLength = 64;
    const byteCount = encodeURI(fields.reference.value).split(/%..|./).length - 1;
    const isBtnDisabled =
      fields.recipient.error || fields.amount.error || fields.reference.error ||
      fields.recipient.value === '' || fields.amount.value === '';

    return (
      <div className={`${styles.wrapper}`}>
        <header className={styles.header}>
          <h1>{this.props.t('Send LSK')}</h1>
        </header>

        <div className={styles.formSection}>
          <span className={`${styles.fieldGroup} recipient`}>
            <span className={`${styles.fieldLabel}`}>{this.props.t('Recipient')}</span>
            <Bookmark
              validateBookmark={this.validateBookmark}
              followedAccounts={this.props.followedAccounts}
              onChange={this.onInputChange}
              placeholder={this.props.t('Insert public address or a name')}
              recipient={fields.recipient}
              showSuggestions={fields.recipient.showSuggestions}
              onSelectedAccount={this.onSelectedAccount}
            />
          </span>

          <label className={`${styles.fieldGroup}`}>
            <span className={`${styles.fieldLabel}`}>{this.props.t('Amount')}</span>
            <span className={`${styles.amountField} amount`}>
              <InputV2
                autoComplete={'off'}
                onChange={this.onAmountOrReferenceChange}
                name='amount'
                value={fields.amount.value}
                placeholder={this.props.t('Amount LSK')}
                className={`${styles.input} ${fields.amount.error ? 'error' : ''}`} />
              <ConverterV2
                className={styles.converter}
                value={fields.amount.value}
                error={fields.amount.error} />
              <SpinnerV2 className={`${styles.spinner} ${this.state.isAmountLoading && fields.amount.value ? styles.show : styles.hide}`}/>
              <img
                className={`${styles.status} ${!this.state.isAmountLoading && fields.amount.value ? styles.show : styles.hide}`}
                src={ fields.amount.error ? svg.alert_icon : svg.ok_icon}
              />
            </span>

            <Feedback
              show={fields.amount.error}
              status={'error'}
              className={`${styles.feedbackMessage} amount-feedback`}
              showIcon={false}>
              {fields.amount.feedback}
            </Feedback>

            <span className={styles.amountHint}>
              {this.props.t('+ Transaction fee {{fee}} LSK', { fee: fromRawLsk(fees.send) })}
              <Tooltip
                className={'showOnTop'}
                title={this.props.t('Transaction fee')}
                footer={
                  <a href={links.transactionFee}
                    rel="noopener noreferrer"
                    target="_blank">
                      {this.props.t('Read More')}
                  </a>
                }
              >
                <p className={styles.tooltipText}>
                {
                  this.props.t(`Every transaction needs to be confirmed and forged into Lisks blockchain network. 
                  Such operations require hardware resources and because of that there is a small fee for processing those.`)
                }
                </p>
              </Tooltip>
            </span>
          </label>

          <label className={`${styles.fieldGroup} reference`}>
            <span className={`${styles.fieldLabel}`}>{this.props.t('Message (optional)')}</span>
            <span className={styles.referenceField}>
              <AutoresizeTextarea
                maxLength={100}
                spellCheck={false}
                onChange={this.onAmountOrReferenceChange}
                onFocus={() => this.setReferenceActive(true)}
                onBlur={() => this.setReferenceActive(false)}
                name='reference'
                value={fields.reference.value}
                placeholder={this.props.t('Write message')}
                className={`${styles.textarea} ${fields.reference.error ? 'error' : ''} message`} />
              <CircularProgress max={64} value={byteCount} className={`${styles.byteCounter} ${fields.reference.isActive ? styles.show : styles.hide}`} />
              <img
                className={`${styles.status} ${styles.referenceStatus} ${fields.reference.isActive || !fields.reference.value ? styles.hide : styles.show}`}
                src={ fields.reference.error ? svg.alert_icon : svg.ok_icon}
              />
            </span>
            <span className={`${styles.feedback} ${fields.reference.error || messageMaxLength - byteCount < 10 ? 'error' : ''} ${fields.reference.isActive || fields.reference.value ? styles.show : ''}`}>
              {fields.reference.feedback}
              <Tooltip
                className={'showOnTop'}
                title={this.props.t('Bytes counter')}
                footer={
                  <a href={links.transactionFee}
                    rel="noopener noreferrer"
                    target="_blank">
                      {this.props.t('Read More')}
                  </a>
                }
              >
                <p className={styles.tooltipText}>
                {
                  this.props.t(`LISK Hub counts your message by bytes so keep in mind 
                  that the length on your message may vary in different languages. 
                  Different characters may consume different amount of bytes space.`)
                }
                </p>
              </Tooltip>
            </span>
          </label>
        </div>

        <footer>
          <PrimaryButtonV2
            className={`${styles.confirmButton} btn-submit send-next-button`}
            disabled={isBtnDisabled}
            onClick={this.onGoNext}
          >
            {this.props.t('Go to Confirmation')}
          </PrimaryButtonV2>
        </footer>
      </div>
    );
  }
}

export default Form;
