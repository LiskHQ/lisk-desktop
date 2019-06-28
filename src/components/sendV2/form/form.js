// eslint-disable-line max-lines
import React from 'react';
import { BigNumber } from 'bignumber.js';
import ConverterV2 from '../../converterV2';
import { PrimaryButtonV2 } from '../../toolbox/buttons/button';
import { InputV2, AutoresizeTextarea } from '../../toolbox/inputsV2';
import Bookmark from '../../bookmarkV2';
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
import { validateAddress } from '../../../utils/validators';
import Selector from '../../toolbox/selector/selector';
import { tokenMap } from '../../../constants/tokens';
import * as btcTransactionsAPI from '../../../utils/api/btc/transactions';

class Form extends React.Component {
  // eslint-disable-next-line max-statements
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
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
          isBookmark: false,
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
        processingSpeed: {
          value: 0,
          loaded: false,
          txFee: 0,
          selectedIndex: 0,
        },
        fee: {
          value: 0,
        },
      },
      unspentTransactionOutputs: [],
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
    this.checkIfBookmarkedAccount = this.checkIfBookmarkedAccount.bind(this);
    this.setReferenceActive = this.setReferenceActive.bind(this);
    this.selectProcessingSpeed = this.selectProcessingSpeed.bind(this);
    this.getProcessingSpeedStatus = this.getProcessingSpeedStatus.bind(this);
  }

  componentDidMount() {
    // istanbul ignore if
    if (!Object.entries(this.props.prevState).length) this.ifDataFromUrl();
    else this.ifDataFromPrevState();
    // istanbul ignore if
    if (this.props.token === tokenMap.BTC.key) this.props.dynamicFeesRetrieved();
    this.checkIfBookmarkedAccount();
  }

  componentDidUpdate() {
    const { fields, unspentTransactionOutputs } = this.state;
    const { token, account, dynamicFees } = this.props;
    // istanbul ignore next
    if (this.props.token === tokenMap.BTC.key && !Object.keys(dynamicFees).length) {
      this.props.dynamicFeesRetrieved();
    }
    if (token === tokenMap.BTC.key
        && account && account.info[token]
        && !unspentTransactionOutputs.length) {
      btcTransactionsAPI
        .getUnspentTransactionOutputs(account.info[token].address)
        .then(data => this.setState(() => ({ unspentTransactionOutputs: data })))
        .catch(() => this.setState(() => ({ unspentTransactionOutputs: [] })));
    }

    // istanbul ignore if
    if (!fields.processingSpeed.loaded && dynamicFees.Low) {
      this.setState(() => ({
        fields: {
          ...fields,
          processingSpeed: {
            value: dynamicFees.Low,
            loaded: true,
            txFee: this.getCalculatedDynamicFee(dynamicFees.Low),
          },
        },
      }));
    }
  }

  ifDataFromPrevState() {
    const { prevState } = this.props;
    // istanbul ignore if
    if (prevState.fields && Object.entries(prevState.fields).length) {
      this.setState(() => ({
        fields: {
          ...prevState.fields,
        },
      }));
    }
  }

  // istanbul ignore next
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

  checkIfBookmarkedAccount() {
    const { fields, token } = this.props;
    const bookmarks = this.props.bookmarks[token];
    const account = bookmarks.length
      ? bookmarks.find(acc => acc.address === fields.recipient.address)
      : false;

    // istanbul ignore if
    if (account) this.onSelectedAccount(account);
  }

  onInputChange({ target }) {
    const { fields } = this.state;
    const txFee = target.name === 'amount'
      ? this.getCalculatedDynamicFee(fields.processingSpeed.value, target.value)
      : fields.processingSpeed.txFee;
    this.setState(() => ({
      fields: {
        ...fields,
        [target.name]: {
          ...fields[target.name],
          value: target.value,
        },
        processingSpeed: {
          ...fields.processingSpeed,
          txFee,
        },
      },
    }));
  }

  // eslint-disable-next-line max-statements
  validateBookmark() {
    const { token } = this.props;
    let recipient = this.state.fields.recipient;
    let isAccountValid = '';
    let isAddressValid = '';
    const bookmarks = this.props.bookmarks[token];

    if (bookmarks.length && recipient.value !== '') {
      isAccountValid = bookmarks
        .find(account => (account.title.toLowerCase() === recipient.value.toLowerCase()) ||
          account.address.toLowerCase() === recipient.value.toLowerCase()) || false;
    }
    isAddressValid = validateAddress(token, recipient.value) === 0;

    // istanbul ignore if
    if (!isAccountValid && !isAddressValid && recipient.value) {
      recipient = {
        ...this.state.recipient,
        address: '',
        balance: '',
        error: true,
        feedback: this.props.t('Provide a correct wallet address or a name of a bookmarked account'),
        selected: false,
        title: '',
        showSuggestions: true,
      };
    }

    // istanbul ignore if
    if (isAddressValid) {
      recipient = {
        ...this.state.recipient,
        address: recipient.value,
        selected: false,
        error: false,
        feedback: '',
        showSuggestions: false,
        isBookmark: false,
      };
    }

    // istanbul ignore if
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
        isBookmark: true,
      };
    }

    // istanbul ignore if
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

    this.setState(({ fields }) => ({
      fields: {
        ...fields,
        recipient: {
          ...fields.recipient,
          ...recipient,
        },
      },
    }));
  }

  // istanbul ignore next
  onSelectedAccount(account) {
    this.setState(({ fields }) => ({
      fields: {
        ...fields,
        recipient: {
          ...fields.recipient,
          ...account,
          value: account.address,
          selected: true,
          error: '',
          feedback: '',
          showSuggestions: false,
          isBookmark: true,
        },
      },
    }));
  }

  getMaxAmount() {
    const { token } = this.props;
    const account = this.props.account.info[token];
    const dynamicFee = this.state.fields.processingSpeed.txFee || 0;
    return token === 'LSK'
      ? fromRawLsk(Math.max(0, account.balance - fees.send))
      : fromRawLsk(Math.max(0, account.balance - dynamicFee));
  }

  getUnspentTransactionOutputCountToConsume(value) {
    const { unspentTransactionOutputs } = this.state;
    const amount = new BigNumber(value);
    const [count] = unspentTransactionOutputs.reduce((result, output) => {
      // istanbul ignore if
      if (amount.isGreaterThan(result[1])) {
        result[0] += 1;
        result[1] = result[1].plus(fromRawLsk(output.value));
      }

      return result;
    }, [0, new BigNumber(0)]);

    return count;
  }

  getCalculatedDynamicFee(dynamicFeePerByte, value) {
    const { fields: { amount } } = this.state;
    if (this.validateAmountField(value || amount.value)) {
      return 0;
    }
    const feeInSatoshis = btcTransactionsAPI.calculateTransactionFee({
      inputCount: this.getUnspentTransactionOutputCountToConsume(value || amount.value),
      outputCount: 2,
      dynamicFeePerByte,
    });

    return feeInSatoshis;
  }

  validateAmountField(value) {
    // istanbul ignore if
    if (/^0.(0|[a-zA-z])*$/g.test(value)) return this.props.t('Provide a correct amount of {{token}}', { token: this.props.token });
    if (/([^\d.])/g.test(value)) return this.props.t('Provide a correct amount of {{token}}', { token: this.props.token });
    if ((/(\.)(.*\1){1}/g.test(value) || /\.$/.test(value)) || value === '0') return this.props.t('Invalid amount');
    if (/\./.test(value) && /\.\d{9}/.test(value)) return this.props.t('Maximum floating point is 8.');
    if (parseFloat(this.getMaxAmount()) < value) return this.props.t('Provided amount is higher than your current balance.');
    return false;
  }

  // istanbul ignore next
  selectProcessingSpeed({ item, index }) {
    this.setState(({ fields }) => ({
      fields: {
        ...fields,
        processingSpeed: {
          ...fields.processingSpeed,
          ...item,
          selectedIndex: index,
          txFee: this.getCalculatedDynamicFee(item.value),
        },
      },
    }));
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

    this.setState(({ fields }) => ({
      fields: {
        ...fields,
        [name]: {
          ...fields[name],
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
      this.setState(() => ({ isLoading: true }));
      this.loaderTimeout = setTimeout(() => {
        this.setState(() => ({ isLoading: false }));
        this.validateAmountAndReference(target.name, target.value);
      }, 300);
    }

    if (target.name === 'reference') {
      this.validateAmountAndReference(target.name, target.value);
    } else {
      this.onInputChange({ target });
    }
  }

  // istanbul ignore next
  onGoNext() {
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    this.props.nextStep({
      fields: { ...this.state.fields },
    });
  }

  setReferenceActive(isActive) {
    this.setState(({ fields }) => ({
      fields: {
        ...fields,
        reference: {
          ...fields.reference,
          isActive,
        },
      },
    }));
  }

  /**
   * Get status of processing soeed fetch based on state of component
   * @returns {Node} - Text to display to the user or loader
   */
  getProcessingSpeedStatus() {
    const { token, t } = this.props;
    const { fields, isLoading } = this.state;
    const { amount: { value } } = fields;
    if (value === '') return <span>-</span>;
    if (isLoading) return <span>{t('Loading')} <SpinnerV2 className={styles.loading} /></span>;
    return <span>{!this.validateAmountField(value)
      ? `${fromRawLsk(fields.processingSpeed.txFee)} ${token}`
      : t('Invalid amount')}</span>;
  }

  // eslint-disable-next-line complexity
  render() {
    const { fields } = this.state;
    const { t, token, dynamicFees } = this.props;
    const messageMaxLength = 64;
    const byteCount = encodeURI(fields.reference.value).split(/%..|./).length - 1;
    const isBtnEnabled =
      ((fields.recipient.value !== '' && !fields.recipient.error)
      && (fields.amount.value !== '' && !fields.amount.error)
      && !fields.reference.error) && !this.state.isLoading;

    return (
      <div className={`${styles.wrapper}`}>
        <header className={styles.header}>
          <h1>{
            localStorage.getItem('btc')
              ? t('Send Tokens')
              : t('Send LSK')
          }</h1>
        </header>
        <div className={styles.formSection}>
          <span className={`${styles.fieldGroup} recipient`}>
            <span className={`${styles.fieldLabel}`}>{t('Recipient')}</span>
            <Bookmark
              validateBookmark={this.validateBookmark}
              bookmarks={this.props.bookmarks}
              onChange={this.onInputChange}
              placeholder={t('Insert public address or a name')}
              recipient={fields.recipient}
              showSuggestions={fields.recipient.showSuggestions}
              onSelectedAccount={this.onSelectedAccount}
              token={token}
            />
          </span>

          <label className={`${styles.fieldGroup}`}>
            <span className={`${styles.fieldLabel}`}>{t('Amount')}</span>
            <span className={`${styles.amountField} amount`}>
              <InputV2
                autoComplete={'off'}
                onChange={this.onAmountOrReferenceChange}
                name='amount'
                value={fields.amount.value}
                placeholder={
                  localStorage.getItem('btc')
                    ? t('Insert the amount of transaction')
                    : t('Amount LSK')
                  }
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

            { token !== 'BTC' ? (
              <span className={styles.amountHint}>
                {t('+ Transaction fee {{fee}} LSK', { fee: fromRawLsk(fees.send) })}
                <Tooltip
                  className={'showOnTop'}
                  title={t('Transaction fee')}
                  footer={
                    <a href={links.transactionFee}
                      rel="noopener noreferrer"
                      target="_blank">
                        {t('Read More')}
                    </a>
                  }
                >
                  <p className={styles.tooltipText}>
                  {
                    t(`Every transaction needs to be confirmed and forged into Lisks blockchain network. 
                    Such operations require hardware resources and because of that there is a small fee for processing those.`)
                  }
                  </p>
                </Tooltip>
              </span>
            ) : null }
          </label>

          { token !== 'BTC' ? (
            <label className={`${styles.fieldGroup} reference`}>
              <span className={`${styles.fieldLabel}`}>{t('Message (optional)')}</span>
              <span className={styles.referenceField}>
                <AutoresizeTextarea
                  maxLength={100}
                  spellCheck={false}
                  onChange={this.onAmountOrReferenceChange}
                  name='reference'
                  value={fields.reference.value}
                  placeholder={t('Write message')}
                  className={`${styles.textarea} ${fields.reference.error ? 'error' : ''} message`}
                />
                <CircularProgress
                  max={64}
                  value={byteCount}
                  className={`${styles.byteCounter}`}
                />
                <img
                  className={`${styles.status} ${styles.referenceStatus} ${!fields.reference.value ? styles.hide : styles.show}`}
                  src={ fields.reference.error ? svg.alert_icon : svg.ok_icon}
                />
              </span>
              <span className={`${styles.feedback} ${fields.reference.error || messageMaxLength - byteCount < 10 ? 'error' : ''} ${styles.show}`}>
                {fields.reference.feedback}
                <Tooltip
                  className={'showOnTop'}
                  title={t('Bytes counter')}
                  footer={
                    <a href={links.transactionFee}
                      rel="noopener noreferrer"
                      target="_blank">
                        {t('Read More')}
                    </a>
                  }
                >
                  <p className={styles.tooltipText}>
                  {
                    t(`LISK Hub counts your message by bytes so keep in mind 
                    that the length on your message may vary in different languages. 
                    Different characters may consume different amount of bytes space.`)
                  }
                  </p>
                </Tooltip>
              </span>
            </label>
          ) : (
            <div className={`${styles.fieldGroup}`}>
              <span className={`${styles.fieldLabel}`}>
                {t('Processing Speed')}
                <Tooltip>
                  <p className={styles.tooltipText}>{
                    t('Bitcoin transactions are made with some delay that depends on two parameters: the fee and the bitcoin network’s congestion. The higher the fee, the higher the processing speed.')
                  }</p>
                </Tooltip>
              </span>
              <Selector
                className={styles.selector}
                onSelectorChange={this.selectProcessingSpeed}
                name={'speedSelector'}
                selectedIndex={fields.processingSpeed.selectedIndex}
                options={[
                  { title: t('Low'), value: dynamicFees.Low },
                  { title: t('High'), value: dynamicFees.High },
                ]}
              />
              <span className={styles.processingInfo}>
                {t('Transaction fee: ')} {this.getProcessingSpeedStatus()}
              </span>
            </div>
          )}
        </div>

        <footer className={`${styles.footer}`}>
          <PrimaryButtonV2
            className={`${styles.confirmButton} btn-submit send-next-button`}
            disabled={!isBtnEnabled}
            onClick={this.onGoNext}
          >
            {t('Go to Confirmation')}
          </PrimaryButtonV2>
        </footer>
      </div>
    );
  }
}

export default Form;
