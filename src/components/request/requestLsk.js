import React from 'react';

import { InputV2, AutoresizeTextarea } from '../toolbox/inputsV2';
import CircularProgress from '../toolbox/circularProgress/circularProgress';
import ConverterV2 from '../converterV2';
import Feedback from '../toolbox/feedback/feedback';
import RequestWrapper from './requestWrapper';
import SpinnerV2 from '../spinnerV2/spinnerV2';
import styles from './request.css';
import svg from '../../utils/svgIcons';

const messageMaxLength = 64;

class RequestLsk extends React.Component {
  constructor(props) {
    super();

    this.state = {
      shareLink: `lisk://wallet/send?recipient=${props.address}`,
      fields: {
        amount: {
          error: false,
          value: '',
          loading: false,
          feedback: '',
        },
        reference: {
          error: false,
          value: '',
          loading: false,
          feedback: '',
        },
      },
    };

    this.timeout = {
      amount: null,
      reference: null,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.updateShareLink = this.updateShareLink.bind(this);
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    clearTimeout(this.timeout.amount);
    clearTimeout(this.timeout.reference);
  }

  validateAmountField(value) {
    if (/([^\d.])/g.test(value)) {
      return this.props.t('Please use only digits and dots');
    } else if (/(\.)(.*\1){1}/g.test(value) || /\.$/.test(value)) {
      return this.props.t('Invalid amount');
    }
    return false;
  }

  // eslint-disable-next-line max-statements
  handleFieldChange({ target }) {
    const { t } = this.props;
    const byteCount = encodeURI(target.value).split(/%..|./).length - 1;
    const error = target.name === 'amount'
      ? this.validateAmountField(target.value)
      : byteCount > messageMaxLength;
    let feedback = '';

    if (target.name === 'amount') {
      target.value = /^\./.test(target.value) ? `0${target.value}` : target.value;
      feedback = error || feedback;
    } else if (target.name === 'reference' && byteCount > 0) {
      feedback = t('{{length}} bytes left', { length: messageMaxLength - byteCount });
    }

    const field = {
      [target.name]: {
        error: !!error,
        value: target.value,
        feedback,
        loading: true,
      },
    };

    const shareLink = this.updateShareLink(field);

    this.setState({
      shareLink,
      fields: {
        ...this.state.fields,
        ...field,
      },
    });

    clearTimeout(this.timeout[target.name]);
    this.timeout[target.name] = setTimeout(() => {
      field[target.name].loading = false;
      this.setState({
        shareLink,
        fields: {
          ...this.state.fields,
          ...field,
        },
      });
    }, 300);
  }

  updateShareLink(newField) {
    const fields = {
      ...this.state.fields,
      ...newField,
    };
    const { address } = this.props;
    return Object.keys(fields).reduce((link, fieldName) => {
      const field = fields[fieldName];
      return field.value !== ''
        ? `${link}&${fieldName}=${encodeURIComponent(field.value)}`
        : link;
    }, `lisk://wallet/send?recipient=${address}`);
  }

  // eslint-disable-next-line complexity
  render() {
    const { t } = this.props;
    const { fields, shareLink } = this.state;
    const byteCount = encodeURI(fields.reference.value).split(/%..|./).length - 1;

    return (
      <RequestWrapper copyLabel={t('Copy Link')} copyValue={shareLink} t={t}>
          <span className={`${styles.label}`}>
            {t('Use the sharing link to easily request any amount of LSK from Lisk Hub or Lisk Mobile users.')}
          </span>
          <label className={`${styles.fieldGroup}`}>
            <span className={`${styles.fieldLabel}`}>{t('Amount')}</span>
            <span className={`${styles.amountField} amount`}>
              <InputV2
                autoComplete={'off'}
                onChange={this.handleFieldChange}
                name='amount'
                value={fields.amount.value}
                placeholder={t('Requested amount')}
                className={`${styles.input} ${fields.amount.error ? 'error' : ''}`} />
              <ConverterV2
                className={styles.converter}
                value={fields.amount.value}
                error={fields.amount.error} />
              <SpinnerV2 className={`${styles.status} ${fields.amount.loading && fields.amount.value ? styles.show : ''}`}/>
              <img
                className={`${styles.status} ${!fields.amount.loading && fields.amount.value ? styles.show : ''}`}
                src={ fields.amount.error ? svg.alert_icon : svg.ok_icon} />
            </span>
            <Feedback
              className={styles.feedback}
              show={fields.amount.error}
              status={fields.amount.error ? 'error' : ''}
              showIcon={false}>
              { fields.amount.feedback }
            </Feedback>
          </label>
          <label className={`${styles.fieldGroup} reference`}>
            <span className={`${styles.fieldLabel}`}>{t('Message (optional)')}</span>
            <span className={`${styles.referenceField}`}>
              <AutoresizeTextarea
                maxLength={100}
                spellCheck={false}
                onChange={this.handleFieldChange}
                name='reference'
                value={fields.reference.value}
                placeholder={t('Write message')}
                className={`${styles.textarea} ${fields.reference.error ? 'error' : ''}`} />
              <CircularProgress max={messageMaxLength} value={byteCount}
                className={styles.byteCounter} />
              <img
                className={`${styles.status} ${!fields.reference.loading && fields.reference.value ? styles.show : ''}`}
                src={ fields.reference.error ? svg.alert_icon : svg.ok_icon} />
            </span>
            <Feedback
              className={`${styles.feedback} ${styles.referenceFeedback}`}
              show={!!fields.reference.feedback}
              status={fields.reference.error ? 'error' : ''}
              showIcon={false}>
              { fields.reference.feedback }
            </Feedback>
          </label>
          <label className={`${styles.fieldGroup}`}>
            <span className={`${styles.fieldLabel}`}>{t('Sharing link')}</span>
            <AutoresizeTextarea
              name='shareLink'
              value={shareLink}
              className={`${styles.textarea} request-link`}
              readOnly />
          </label>
      </RequestWrapper>
    );
  }
}

export default RequestLsk;
