import React from 'react';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { translate } from 'react-i18next';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';
import SpinnerV2 from '../spinnerV2/spinnerV2';
import { InputV2, AutoresizeTextarea } from '../toolbox/inputsV2';
import ConverterV2 from '../converterV2';
import CircularProgress from '../toolbox/circularProgress/circularProgress';
import svg from '../../utils/svgIcons';
import styles from './requestV2.css';

class RequestV2 extends React.Component {
  constructor(props) {
    super();

    this.state = {
      showQRCode: false,
      shareLink: `lisk://wallet/send?recipient=${props.address}`,
      linkCopied: false,
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
      copy: null,
    };

    this.toggleQRCode = this.toggleQRCode.bind(this);
    this.onCopy = this.onCopy.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.updateShareLink = this.updateShareLink.bind(this);
  }

  onCopy() {
    clearTimeout(this.timeout.copy);
    this.timeout.copy = setTimeout(() => this.setState({
      linkCopied: false,
    }), 3000);

    this.setState({
      linkCopied: true,
    });
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    clearTimeout(this.timeout.amount);
    clearTimeout(this.timeout.reference);
    clearTimeout(this.timeout.copy);
  }

  toggleQRCode() {
    this.setState(prevState => ({
      showQRCode: !prevState.showQRCode,
    }));
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
    const messageMaxLength = 64;
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
    const { fields, shareLink, showQRCode } = this.state;
    const byteCount = encodeURI(fields.reference.value).split(/%..|./).length - 1;

    return (
      <div className={`${styles.container}`}>
        <section className={`${styles.formSection}`}>
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
            <span className={`${styles.feedback} ${fields.amount.error ? 'error' : ''} ${fields.amount.feedback ? styles.show : ''}`}>
              {fields.amount.feedback}
            </span>
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
              <CircularProgress max={64} value={byteCount}
                className={styles.byteCounter} />
              <img
                className={`${styles.status} ${!fields.reference.loading && fields.reference.value ? styles.show : ''}`}
                src={ fields.reference.error ? svg.alert_icon : svg.ok_icon} />
            </span>
            <span className={`${styles.feedback} ${styles.referenceFeedback} ${fields.reference.error ? 'error' : ''} ${fields.reference.feedback ? styles.show : ''}`}>
              {fields.reference.feedback}
            </span>
          </label>
          <label className={`${styles.fieldGroup}`}>
            <span className={`${styles.fieldLabel}`}>{t('Sharing link')}</span>
            <AutoresizeTextarea
              name='shareLink'
              value={shareLink}
              className={`${styles.textarea} request-link`}
              readOnly />
          </label>
          <footer className={`${styles.sectionFooter}`}>
            <CopyToClipboard
              onCopy={this.onCopy}
              text={shareLink}>
                <PrimaryButtonV2
                  className={'extra-small'}
                  disabled={this.state.linkCopied}>
                  {this.state.linkCopied
                    ? t('Link copied')
                    : t('Copy Link')
                  }
                </PrimaryButtonV2>
            </CopyToClipboard>
            <span className={`${styles.footerContent} ${showQRCode ? styles.hide : ''}`}>
              {t('Got the Lisk Mobile App?')} <span
                className={`${styles.footerActionable} toggle-qrcode`}
                onClick={this.toggleQRCode}>{t('Show the QR code')}
              </span>
            </span>
          </footer>
        </section>
        <section className={`${styles.qrSection} ${!showQRCode ? styles.hide : ''} qrcode-section`}>
          <span className={`${styles.label}`}>
            {t('Simply scan the QR code using the Lisk Mobile app or any other QR code reader')}
          </span>
          <div className={`${styles.qrCodeContainer}`}>
            <QRCode value={shareLink} size={235} />
          </div>
          <footer className={`${styles.sectionFooter}`}>
            <span
              className={`${styles.footerContent} ${styles.footerActionable}`}
              onClick={this.toggleQRCode}>{t('Hide the QR code')}</span>
          </footer>
        </section>
      </div>
    );
  }
}

export default translate()(RequestV2);
