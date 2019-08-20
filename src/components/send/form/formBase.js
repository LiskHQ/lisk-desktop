// eslint-disable-line max-lines
// TODO Split this Send form component into following 4:
// - FormWrapper - decides to render FormLSK or FormBTC based on activeToken
// - FormLSK - Contains all LSK-specific functionality (message, static fee) and renders FormBase
// - FormBTC - Contains all BTC-specific functionality (dynamic fee selection) and renders FormBase
// - FormBase - Contains all functionality common to LSK and BTC (Box, address input,
//     amount input, confirm button)
import React from 'react';
import Converter from '../../converter';
import { PrimaryButton } from '../../toolbox/buttons/button';
import { Input } from '../../toolbox/inputs';
import { getNetworkCode } from '../../../utils/api/btc/network';
import AutoSuggest from '../autoSuggest';
import Spinner from '../../spinner/spinner';
import Tooltip from '../../toolbox/tooltip/tooltip';
import links from '../../../constants/externalLinks';
import { fromRawLsk } from '../../../utils/lsk';
import Feedback from '../../toolbox/feedback/feedback';
import styles from './form.css';
import Piwik from '../../../utils/piwik';
import { validateAddress } from '../../../utils/validators';
import Icon from '../../toolbox/icon';
import Box from '../../toolbox/box';

function getInitialState() {
  return {
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
      fee: {
        value: 0,
      },
    },
    unspentTransactionOutputs: [],
  };
}

class FormBase extends React.Component {
  // eslint-disable-next-line max-statements
  constructor(props) {
    super(props);

    this.state = getInitialState();

    this.loaderTimeout = null;

    this.getMaxAmount = this.getMaxAmount.bind(this);
    this.ifDataFromPrevState = this.ifDataFromPrevState.bind(this);
    this.ifDataFromUrl = this.ifDataFromUrl.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.onGoNext = this.onGoNext.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onSelectedAccount = this.onSelectedAccount.bind(this);
    this.validateAmountAndReference = this.validateAmountAndReference.bind(this);
    this.validateBookmark = this.validateBookmark.bind(this);
    this.checkIfBookmarkedAccount = this.checkIfBookmarkedAccount.bind(this);
  }

  componentDidMount() {
    // istanbul ignore if
    if (!Object.entries(this.props.prevState).length) this.ifDataFromUrl();
    else this.ifDataFromPrevState();
    this.checkIfBookmarkedAccount();
  }

  // TODO move `state.fields` into parent send component and ifDataFromPrevState can be deleted
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

  // TODO move `state.fields` into parent send component and ifDataFromUrl can be deleted
  // istanbul ignore next
  ifDataFromUrl() {
    const { fields = {} } = this.props;
    if (fields.recipient.address !== '' || fields.amount.value !== '') {
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
    const { onInputChange } = this.props;
    const newState = {
      ...fields[target.name],
      value: target.value,
    };
    onInputChange({ target }, newState);
    this.setState(() => ({
      fields: {
        ...fields,
        [target.name]: newState,
      },
    }));
  }

  // TODO move bookmark validation into a separate util or component
  // eslint-disable-next-line max-statements
  validateBookmark() {
    const { token, networkConfig } = this.props;
    let recipient = this.state.fields.recipient;
    let isAccountValid = '';
    let isAddressValid = '';
    const bookmarks = this.props.bookmarks[token];

    if (bookmarks.length && recipient.value !== '') {
      isAccountValid = bookmarks
        .find(account => (account.title.toLowerCase() === recipient.value.toLowerCase())
          || account.address.toLowerCase() === recipient.value.toLowerCase()) || false;
    }
    isAddressValid = validateAddress(token, recipient.value, getNetworkCode(networkConfig)) === 0;

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
    const { token, fee } = this.props;
    const account = this.props.account.info[token];
    return fromRawLsk(Math.max(0, account.balance - fee));
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

  validateAmountAndReference(name, value) {
    let feedback = '';
    let error = '';

    // istanbul ignore else
    if (name === 'amount') {
      value = /^\./.test(value) ? `0${value}` : value;
      error = this.validateAmountField(value);
      feedback = error || feedback;
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

  onAmountChange({ target }) {
    clearTimeout(this.loaderTimeout);

    this.setState(() => ({ isLoading: true }));
    this.loaderTimeout = setTimeout(() => {
      this.setState(() => ({ isLoading: false }));
      this.validateAmountAndReference(target.name, target.value);
    }, 300);

    this.onInputChange({ target });
  }

  // istanbul ignore next
  onGoNext() {
    const { nextStep, extraFields } = this.props;
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    nextStep({
      fields: { ...this.state.fields, ...extraFields },
    });
  }

  // eslint-disable-next-line complexity
  render() {
    const { fields } = this.state;
    const {
      t, token, children, extraFields, fee,
    } = this.props;
    const isBtnEnabled = ((fields.recipient.value !== '' && !fields.recipient.error)
      && (fields.amount.value !== '' && !fields.amount.error)
      && !Object.values(extraFields).find(({ error }) => error)) && !this.state.isLoading;

    return (
      <Box className={styles.wrapper} width="medium">
        <Box.Header>
          <h1>{ t('Send {{token}}', { token }) }</h1>
        </Box.Header>
        <Box.Content className={styles.formSection}>
          <span className={`${styles.fieldGroup} recipient`}>
            <span className={`${styles.fieldLabel}`}>{t('Recipient')}</span>
            <AutoSuggest
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
              <Input
                autoComplete="off"
                onChange={this.onAmountChange}
                name="amount"
                value={fields.amount.value}
                placeholder={t('Insert the amount of transaction')}
                className={`${styles.input} ${fields.amount.error ? 'error' : ''}`}
              />
              <Converter
                className={styles.converter}
                value={fields.amount.value}
                error={fields.amount.error}
              />
              <Spinner className={`${styles.spinner} ${this.state.isLoading && fields.amount.value ? styles.show : styles.hide}`} />
              <Icon
                className={`${styles.status} ${!this.state.isLoading && fields.amount.value ? styles.show : styles.hide}`}
                name={fields.amount.error ? 'alertIcon' : 'okIcon'}
              />
            </span>

            <Feedback
              show={fields.amount.error}
              status="error"
              className={`${styles.feedbackMessage} amount-feedback`}
              showIcon={false}
            >
              {fields.amount.feedback}
            </Feedback>

            { !extraFields.processingSpeed ? (
              <span className={styles.amountHint}>
                {t('+ Transaction fee {{fee}} LSK', { fee: fromRawLsk(fee) })}
                <Tooltip
                  className="showOnTop"
                  title={t('Transaction fee')}
                  footer={(
                    <a
                      href={links.transactionFee}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {t('Read more')}
                    </a>
)}
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
          { children }
        </Box.Content>
        <Box.Footer>
          <PrimaryButton
            className={`${styles.confirmButton} btn-submit send-next-button`}
            disabled={!isBtnEnabled}
            onClick={this.onGoNext}
          >
            {t('Go to confirmation')}
          </PrimaryButton>
        </Box.Footer>
      </Box>
    );
  }
}

FormBase.defaultProps = {
  extraFields: {},
  onInputChange: () => {},
};

export default FormBase;
