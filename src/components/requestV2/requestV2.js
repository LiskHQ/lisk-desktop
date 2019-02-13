import React from 'react';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { translate } from 'react-i18next';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';
import { InputV2, AutoresizeTextarea } from '../toolbox/inputsV2';
import ConverterV2 from '../converterV2';
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
          feedback: '',
        },
        reference: {
          error: false,
          value: '',
          feedback: '',
        },
      },
    };

    this.toggleQRCode = this.toggleQRCode.bind(this);
    this.onCopy = this.onCopy.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.updateShareLink = this.updateShareLink.bind(this);
  }

  onCopy() {
    clearTimeout(this.timeout);
    setTimeout(() => this.setState({
      linkCopied: false,
    }), 3000);

    this.setState({
      linkCopied: true,
    });
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  toggleQRCode() {
    this.setState(prevState => ({
      showQRCode: !prevState.showQRCode,
    }));
  }

  // eslint-disable-next-line max-statements
  handleFieldChange({ target }) {
    const { t } = this.props;
    const messageMaxLength = 64;
    const error = target.name === 'amount'
      ? /([^\d.])/g.test(target.value) || /(\.)(.*\1){1}/g.test(target.value)
      : target.value.length > messageMaxLength;
    let feedback = '';

    if (target.name === 'amount') {
      target.value = /^\./.test(target.value) ? `0${target.value}` : target.value;
      feedback = error ? t('Please use only digits and dots') : feedback;
    } else if (target.name === 'message' && target.value.length > 0) {
      feedback = error
        ? t('{{length}} extra characters', { length: target.value.length - messageMaxLength })
        : t('{{length}} out of {{total}} characters left', {
          length: messageMaxLength - target.value.length,
          total: messageMaxLength,
        });
    }

    const field = {
      [target.name]: {
        error,
        value: target.value,
        feedback,
      },
    };

    const shareLink = this.updateShareLink(field);

    this.setState(prevState => ({
      shareLink,
      fields: {
        ...prevState.fields,
        ...field,
      },
    }));
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
        ? `${link}&${fieldName}=${encodeURI(field.value)}`
        : link;
    }, `lisk://wallet/send?recipient=${address}`);
  }

  // eslint-disable-next-line complexity
  render() {
    const { t } = this.props;
    const { fields, shareLink, showQRCode } = this.state;
    const messageMaxLength = 64;
    return (
      <div className={`${styles.container}`}>
        <section className={`${styles.formSection}`}>
          <span className={`${styles.label}`}>
            {t('Use the sharing link to easily request any amount of LSK from Lisk Hub or Lisk Mobile users.')}
          </span>
          <label className={`${styles.fieldGroup}`}>
            <span className={`${styles.fieldLabel}`}>{t('Amount (LSK)')}</span>
            <span className={`${styles.amountField}`}>
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
            </span>
            <span className={`${styles.feedback} ${fields.amount.error ? 'error' : ''} ${fields.amount.feedback ? styles.show : ''}`}>
              {fields.amount.feedback}
            </span>
          </label>
          <label className={`${styles.fieldGroup}`}>
            <span className={`${styles.fieldLabel}`}>{t('Message (optional)')}</span>
            <AutoresizeTextarea
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
          <label className={`${styles.fieldGroup}`}>
            <span className={`${styles.fieldLabel}`}>{t('Sharing link')}</span>
            <AutoresizeTextarea
              name='shareLink'
              value={shareLink}
              className={`${styles.textarea}`}
              readOnly />
          </label>
          <footer className={`${styles.sectionFooter}`}>
            <CopyToClipboard
              onCopy={this.onCopy}
              text={shareLink}>
                <PrimaryButtonV2
                  disabled={this.state.linkCopied}>
                  {this.state.linkCopied
                    ? t('Link copied')
                    : t('Copy Link')
                  }
                </PrimaryButtonV2>
            </CopyToClipboard>
            <span className={`${styles.footerContent} ${showQRCode ? styles.hide : ''}`}>
              {t('Got the Lisk Mobile App?')} <span
                className={`${styles.footerActionable}`}
                onClick={this.toggleQRCode}>{t('Show the QR code')}
              </span>
            </span>
          </footer>
        </section>
        <section className={`${styles.qrSection} ${!showQRCode ? styles.hide : ''}`}>
          <span className={`${styles.label}`}>
            {t('Simply scan the QR code using the Lisk Mobile app or any other QR code reader')}
          </span>
          <div className={`${styles.qrCodeContainer}`}>
            <QRCode value={shareLink} size={200} />
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
