import React from 'react';
import ConverterV2 from '../../converterV2';
import { PrimaryButtonV2 } from '../../toolbox/buttons/button';
import { InputV2, AutoresizeTextarea } from '../../toolbox/inputsV2';
import svg from '../../../utils/svgIcons';
import inputRegex from '../../../utils/regex';
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
          error: false,
          value: '',
          feedback: '',
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
  }

  validateAmountField(value) {
    if (/([^\d.])/g.test(value)) return this.props.t('Please use only digits and dots');
    if (/(\.)(.*\1){1}/g.test(value) || /\.$/.test(value)) return this.props.t('Invalid amount');
    return false;
  }

  setInputValues(target, error, feedback) {
    const field = {
      [target.name]: {
        error: !!error,
        value: target.value,
        feedback,
      },
    };

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

    if (target.name === 'recipient') {
      error = !inputRegex.address.test(target.value);
      feedback = error
        ? t('Provide a correct wallet address or a name of a followed account')
        : feedback;
    }

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
    const { t } = this.props;
    const { fields } = this.state;
    const messageMaxLength = 64;

    return (
      <div className={`${styles.wrapper}`}>
        <header className={styles.header}>
          <h1>{this.props.t('Send LSK')}</h1>
        </header>

        <div className={styles.formSection}>
          <label className={`${styles.fieldGroup}`}>
            <span className={`${styles.fieldLabel}`}>{t('Recipient')}</span>
            <span className={`${styles.amountField} recipient`}>
            <InputV2
              autoComplete={'off'}
              onChange={this.handleFieldChange}
              name='recipient'
              value={fields.recipient.value}
              placeholder={t('e.g. 12345.6')}
              className={`${styles.input} ${fields.recipient.error ? 'error' : ''} recipient`}
            />
            </span>
            <span className={`${styles.feedback} ${fields.recipient.error ? 'error' : ''} ${fields.recipient.feedback ? styles.show : ''}`}>
              {fields.recipient.feedback}
            </span>
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
            <span className={`${styles.feedback} ${fields.reference.error || messageMaxLength - fields.reference.value.length < 10 ? 'error' : ''} ${fields.reference.feedback ? styles.show : ''}`}>
              {fields.reference.feedback}
            </span>
          </label>
        </div>

        <footer>
          <PrimaryButtonV2 className={styles.confirmButton}>{t('Go to Confirmation')}</PrimaryButtonV2>
        </footer>
      </div>
    );
  }
}

export default Form;
