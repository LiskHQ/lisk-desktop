import React from 'react';
import { translate } from 'react-i18next';
import { AutoresizeTextarea } from '../../toolbox/inputs';
import Feedback from '../../toolbox/feedback/feedback';
import CircularProgress from '../../toolbox/circularProgress/circularProgress';
import svg from '../../../utils/svgIcons';
import styles from './filters.css';

class MessageFieldGroup extends React.Component {
  constructor() {
    super();

    this.state = {
      fields: {
        message: {
          value: '',
          error: false,
        },
      },
      feedback: '',
    };

    this.timeout = null;

    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange({ target }) {
    const { t } = this.props;
    const messageMaxLength = 62;
    const byteCount = encodeURI(target.value).split(/%..|./).length - 1;
    const error = byteCount > messageMaxLength;
    const feedback = error
      ? t('Maximum length exceeded')
      : '';
    const fields = {
      message: {
        value: target.value,
        error,
        loading: true,
      },
    };

    this.props.updateCustomFilters(fields);

    this.setState({ fields, feedback });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.updateCustomFilters({
        message: {
          ...fields.message,
          loading: false,
        },
      });
      this.setState({
        fields: {
          message: {
            ...fields.message,
            loading: false,
          },
        },
      });
    }, 300);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { handleKeyPress, t, filters } = this.props;
    const { fields } = this.state;
    const byteCount = encodeURI(filters.message).split(/%..|./).length - 1;

    return (
      <label className={`${styles.fieldGroup} message-field`}>
        <span className={styles.fieldLabel}>{t('Message')}</span>
        <div className={`${styles.fieldRow} ${styles.fieldHolder} reference-field`}>
          <AutoresizeTextarea
            autoComplete="off"
            onChange={this.handleFieldChange}
            name="message"
            value={filters.message}
            placeholder={t('Write message')}
            maxLength={100}
            onKeyDown={handleKeyPress}
            className={`${styles.input} ${fields.message.error ? 'error' : ''}`}
          />
          <CircularProgress
            max={62}
            value={byteCount}
            className={styles.byteCounter}
          />
          <img
            className={`${styles.status} ${!fields.message.loading && filters.message ? styles.show : ''}`}
            src={fields.message.error ? svg.alertIcon : svg.okIcon}
          />
        </div>
        <Feedback
          className={styles.feedback}
          show={fields.message.error}
          status={fields.message.error ? 'error' : ''}
          showIcon={false}
        >
          { this.state.feedback }
        </Feedback>
      </label>
    );
  }
}

export default translate()(MessageFieldGroup);
