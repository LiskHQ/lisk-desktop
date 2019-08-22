// eslint-disable-line max-lines
import React from 'react';
import numeral from 'numeral';
import { Input } from '../../toolbox/inputs';
import { PrimaryButton } from '../../toolbox/buttons/button';
import { formatAmountBasedOnLocale } from '../../../utils/formattedNumber';
import { fromRawLsk } from '../../../utils/lsk';
import { getNetworkCode } from '../../../utils/api/btc/network';
import { validateAddress, validateAmountFormat } from '../../../utils/validators';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import Box from '../../toolbox/box';
import Converter from '../../converter';
import Feedback from '../../toolbox/feedback/feedback';
import Icon from '../../toolbox/icon';
import Piwik from '../../../utils/piwik';
import Spinner from '../../spinner/spinner';
import Tooltip from '../../toolbox/tooltip/tooltip';
import i18n from '../../../i18n';
import links from '../../../constants/externalLinks';
import regex from '../../../utils/regex';
import styles from './form.css';

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
    },
    unspentTransactionOutputs: [],
  };
}

class FormBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = getInitialState();

    this.loaderTimeout = null;

    this.onAmountChange = this.onAmountChange.bind(this);
    this.onGoNext = this.onGoNext.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onSelectedAccount = this.onSelectedAccount.bind(this);
    this.validateBookmark = this.validateBookmark.bind(this);
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
    const { fields = {}, onInputChange } = this.props;
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
      onInputChange({
        target: {
          name: 'amount',
          value: fields.amount.value,

        },
      }, {
        value: fields.amount.value,
      });
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
    const { message, error } = validateAmountFormat({
      value,
      token: this.props.token,
      locale: i18n.language,
    });
    if (error) return message;
    if (parseFloat(this.getMaxAmount()) < numeral(value).value()) {
      return this.props.t('Provided amount is higher than your current balance.');
    }
    return false;
  }

  validateAmount(name, value) {
    let feedback = '';
    let error = '';

    // istanbul ignore else
    if (name === 'amount') {
      const { leadingPoint } = regex.amount[i18n.language];
      value = leadingPoint.test(value) ? `0${value}` : value;
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
      this.validateAmount(target.name, target.value);
    }, 300);

    this.onInputChange({ target });
  }

  // istanbul ignore next
  onGoNext() {
    const { nextStep, extraFields } = this.props;
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    nextStep({
      fields: { ...extraFields, ...this.state.fields },
    });
  }

  render() {
    const { fields, isLoading } = this.state;
    const {
      t, token, children, extraFields, fee,
    } = this.props;
    const isBtnEnabled = !isLoading
      && !Object.values(fields).find(({ error, value }) => error || value === '')
      && !Object.values(extraFields).find(({ error }) => error);

    return (
      <Box className={styles.wrapper} width="medium">
        <Box.Header>
          <h1>{ t('Send {{token}}', { token }) }</h1>
        </Box.Header>
        <Box.Content className={styles.formSection}>
          <span className={`${styles.fieldGroup} recipient`}>
            <span className={`${styles.fieldLabel}`}>{t('Recipient')}</span>
            <BookmarkAutoSuggest
              validateBookmark={this.validateBookmark}
              recipient={fields.recipient}
              bookmarks={this.props.bookmarks}
              onInputChange={this.onInputChange}
              onSelectedAccount={this.onSelectedAccount}
              token={token}
              t={t}
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
                {t('+ Transaction fee {{fee}} LSK', {
                  fee: formatAmountBasedOnLocale({ value: fromRawLsk(fee) }),
                })}
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
