// eslint-disable-line max-lines
import React from 'react';
import ConverterV2 from '../../converterV2';
import { PrimaryButtonV2 } from '../../toolbox/buttons/button';
import { InputV2, AutoresizeTextarea } from '../../toolbox/inputsV2';
import Bookmark from '../../bookmarkV2';
import regex from '../../../utils/regex';
import svg from '../../../utils/svgIcons';
import styles from './form.css';
// import fees from '../../../constants/fees';
// import regex from '../../../utils/regex';
// import { fromRawLsk } from '../../../utils/lsk';
// import { authStatePrefill } from '../../../utils/form';
// import AddressInput from '../../addressInput';
// import ReferenceInput from '../../referenceInput';
// import Piwik from '../../../utils/piwik';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showQRCode: false,
      shareLink: `lisk://wallet/send?recipient=${props.address}`,
      linkCopied: false,
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
        },
        amount: {
          error: false,
          value: '',
          feedback: '',
        },
        reference: {
          error: false,
          value: '',
          feedback: '',
        },
      },
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.onSelectedAccount = this.onSelectedAccount.bind(this);
    this.onBookmarkChange = this.onBookmarkChange.bind(this);
    this.onSelectedAccount = this.onSelectedAccount.bind(this);
    this.onBookmarkBlur = this.onBookmarkBlur.bind(this);
  }

  // eslint-disable-next-line max-statements
  onBookmarkChange({ target }) {
    const { followedAccounts } = this.props;
    let recipient = this.state.recipient;
    let isAccountValid = '';
    let isAddressValid = '';
    const newValue = target.value;

    if (followedAccounts.length && newValue !== '') {
      isAccountValid = followedAccounts
        .find(account => account.title.toLowerCase() === newValue.toLowerCase()) || false;
      isAddressValid = regex.address.test(newValue);
    } else {
      isAddressValid = newValue.match(regex.address);
    }

    if (isAddressValid) {
      recipient = {
        ...this.state.recipient,
        address: newValue,
        selected: false,
        error: false,
        feedback: '',
        showSuggestions: false,
      };
    }

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
      };
    }

    if (!isAccountValid && !isAddressValid && newValue) {
      recipient = {
        ...this.state.recipient,
        address: '',
        balance: '',
        error: true,
        feedback: 'Provide a correct wallet address or a name of a followed account',
        selected: false,
        title: '',
        showSuggestions: true,
      };
    }

    if (newValue === '') {
      recipient = {
        ...this.state.recipient,
        address: '',
        balance: '',
        error: false,
        feedback: '',
        selected: false,
        title: '',
        showSuggestions: false,
      };
    }

    this.setState({
      fields: {
        ...this.state.fields,
        recipient: {
          ...this.state.fields.recipient,
          ...recipient,
          value: newValue,
        },
      },
    });
  }

  onSelectedAccount(account) {
    this.setState({
      fields: {
        ...this.state.fields,
        recipient: {
          ...this.state.fields.recipient,
          ...account,
          value: account.address,
          selected: true,
          error: '',
          feedback: '',
          showSuggestions: false,
        },
      },
    });
  }

  onBookmarkBlur() {
    this.setState({
      fields: {
        ...this.state.fields,
        recipient: {
          ...this.state.fields.recipient,
          showSuggestions: false,
        },
      },
    });
  }

  validateAmountField(value) {
    if (/([^\d.])/g.test(value)) return this.props.t('Please use only digits and dots');
    if (/(\.)(.*\1){1}/g.test(value) || /\.$/.test(value)) return this.props.t('Invalid amount');
    return false;
  }

  setInputValues(target, error, feedback) {
    let field = '';

    if (target.name === 'recipient') {
      field = {
        [target.name]: {
          ...target,
        },
      };
    } else {
      field = {
        [target.name]: {
          error: !!error,
          value: target.value,
          feedback,
        },
      };
    }

    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        ...field,
      },
    }));
  }

  // eslint-disable-next-line max-statements
  handleFieldChange({ target }) {
    const { t } = this.props;
    const messageMaxLength = 64;
    let feedback = '';
    let error = '';

    if (target.name === 'amount') {
      target.value = /^\./.test(target.value) ? `0${target.value}` : target.value;
      error = this.validateAmountField(target.value);
      feedback = error || feedback;
    }

    if (target.name === 'reference' && target.value.length > 0) {
      error = target.value.length > messageMaxLength;
      feedback = error
        ? t('{{length}} extra characters', { length: target.value.length - messageMaxLength })
        : t('{{length}} out of {{total}} characters left', {
          length: messageMaxLength - target.value.length,
          total: messageMaxLength,
        });
    }

    this.setInputValues(target, error, feedback);
  }

  // eslint-disable-next-line complexity
  render() {
    const { t, followedAccounts } = this.props;
    const { fields } = this.state;
    const messageMaxLength = 64;
    const btnDisabled =
      fields.recipient.error || fields.amount.error || fields.reference.error ||
      fields.recipient.value === '' || fields.amount.value === '';

    return (
      <div className={`${styles.wrapper}`}>
        <header className={styles.header}>
          <h1>{this.props.t('Send LSK')}</h1>
        </header>

        <div className={styles.formSection}>
          <label className={`${styles.fieldGroup}`}>
            <span className={`${styles.fieldLabel}`}>{t('Recipient')}</span>
            <Bookmark
              t={t}
              followedAccounts={followedAccounts}
              onChange={this.onBookmarkChange}
              placeholder={'e.g. 1234523423L or John Doe'}
              recipient={fields.recipient}
              showSuggestions={fields.recipient.showSuggestions}
              onSelectedAccount={this.onSelectedAccount}
            />
          </label>

          <label className={`${styles.fieldGroup}`}>
            <span className={`${styles.fieldLabel}`}>{t('Amount of trasaction')}</span>
            <span className={`${styles.amountField} amount`}>
              <InputV2
                autoComplete={'off'}
                onChange={this.handleFieldChange}
                name='amount'
                value={fields.amount.value}
                placeholder={t('e.g. 12345.6')}
                className={`${styles.input} ${fields.amount.error ? 'error' : ''}`} />
              <ConverterV2
                className={styles.converter}
                value={fields.amount.value}
                error={fields.amount.error} />
              {
                fields.amount.value
                ? <img
                    className={styles.status}
                    src={fields.amount.error ? svg.alert_icon : svg.ok_icon}
                  />
                : null
              }
            </span>
            <span className={`${styles.feedback} ${fields.amount.error ? 'error' : ''} ${fields.amount.feedback ? styles.show : ''}`}>
              {fields.amount.feedback}
            </span>
            <span className={styles.amountHint}>
              {t('+0.1 LSK transaction fee')}
              <img src={svg.question_icon} />
            </span>
          </label>

          <label className={`${styles.fieldGroup} reference`}>
            <span className={`${styles.fieldLabel}`}>{t('Message (optional)')}</span>
            <AutoresizeTextarea
              maxLength={100}
              spellCheck={false}
              onChange={this.handleFieldChange}
              name='reference'
              value={fields.reference.value}
              placeholder={t('Write message')}
              className={`${styles.textarea} ${fields.reference.error ? 'error' : ''}`} />
            {
              fields.reference.value
              ? <img
                  className={styles.status}
                  src={fields.reference.error ? svg.alert_icon : svg.ok_icon}
                />
              : null
            }
            <span className={`${styles.feedback} ${fields.reference.error || messageMaxLength - fields.reference.value.length < 10 ? 'error' : ''} ${fields.reference.feedback ? styles.show : ''}`}>
              {fields.reference.feedback}
            </span>
          </label>
        </div>

        <footer>
          <PrimaryButtonV2 className={styles.confirmButton} disabled={btnDisabled}>
            {t('Go to Confirmation')}
          </PrimaryButtonV2>
        </footer>
      </div>
    );
  }
}

export default Form;
