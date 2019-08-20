import React from 'react';
import { AutoresizeTextarea } from '../../toolbox/inputs';
import { parseSearchParams } from '../../../utils/searchParams';
import CircularProgress from '../../toolbox/circularProgress/circularProgress';
import Fees from '../../../constants/fees';
import FormBase from './formBase';
import Icon from '../../toolbox/icon';
import Tooltip from '../../toolbox/tooltip/tooltip';
import links from '../../../constants/externalLinks';
import styles from './form.css';

export default class FormLsk extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState(props);

    this.loaderTimeout = null;
    this.messageMaxLength = 64;

    this.onReferenceChange = this.onReferenceChange.bind(this);
    this.setReferenceActive = this.setReferenceActive.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getInitialState(props) {
    const { reference } = parseSearchParams(props.history.location.search);
    return {
      fields: {
        reference: {
          error: false,
          value: reference || '',
          feedback: props.t('64 bytes left'),
          isActive: false,
        },
      },
    };
  }

  onReferenceChange({ target: { name, value } }) {
    const { t } = this.props;
    const byteCount = encodeURI(value).split(/%..|./).length - 1;

    this.setState(({ fields }) => ({
      fields: {
        ...fields,
        [name]: {
          ...fields[name],
          error: byteCount > this.messageMaxLength,
          value,
          feedback: t('{{length}} bytes left', { length: this.messageMaxLength - byteCount }),
        },
      },
    }));
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

  render() {
    const { fields } = this.state;
    const { t } = this.props;
    const byteCount = encodeURI(fields.reference.value).split(/%..|./).length - 1;
    return (
      <FormBase
        {...this.props}
        extraFields={fields}
        fee={Fees.send}
      >
        <label className={`${styles.fieldGroup} reference`}>
          <span className={`${styles.fieldLabel}`}>{t('Message (optional)')}</span>
          <span className={styles.referenceField}>
            <AutoresizeTextarea
              maxLength={100}
              spellCheck={false}
              onChange={this.onReferenceChange}
              name="reference"
              value={fields.reference.value}
              placeholder={t('Write message')}
              className={`${styles.textarea} ${fields.reference.error ? 'error' : ''} message`}
            />
            <CircularProgress
              max={this.messageMaxLength}
              value={byteCount}
              className={`${styles.byteCounter} ${fields.reference.error ? styles.hide : ''}`}
            />
            <Icon
              className={`${styles.status} ${styles.referenceStatus} ${!fields.reference.value ? styles.hide : styles.show}`}
              name={fields.reference.error ? 'alertIcon' : 'okIcon'}
            />
          </span>
          <span className={`${styles.feedback} ${fields.reference.error || this.messageMaxLength - byteCount < 10 ? 'error' : ''} ${styles.show}`}>
            {fields.reference.feedback}
            <Tooltip
              className="showOnTop"
              title={t('Bytes counter')}
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
                    t(`LISK Hub counts your message by bytes so keep in mind 
                    that the length on your message may vary in different languages. 
                    Different characters may consume different amount of bytes space.`)
                  }
              </p>
            </Tooltip>
          </span>
        </label>
      </FormBase>
    );
  }
}
