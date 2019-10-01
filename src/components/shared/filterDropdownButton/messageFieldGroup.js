import React from 'react';
import { withTranslation } from 'react-i18next';
import { AutoresizeTextarea } from '../../toolbox/inputs';
import Feedback from '../../toolbox/feedback/feedback';
import CircularProgress from '../../toolbox/circularProgress/circularProgress';
import styles from './filters.css';
import Icon from '../../toolbox/icon';

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
    const { t, filters, label } = this.props;
    const { fields } = this.state;
    const byteCount = encodeURI(filters.message).split(/%..|./).length - 1;

    return (
      <label className={`${styles.fieldGroup} message-field`}>
        <span className={styles.fieldLabel}>{label}</span>
        <div className={`${styles.fieldRow} ${styles.fieldHolder} reference-field`}>
          <AutoresizeTextarea
            autoComplete="off"
            onChange={this.handleFieldChange}
            name="message"
            value={filters.message}
            placeholder={t('Write message')}
            maxLength={100}
            className={`${styles.input} ${fields.message.error ? 'error' : ''}`}
          />
          <CircularProgress
            max={62}
            value={byteCount}
            className={styles.byteCounter}
          />
          <Icon
            className={`${styles.status} ${!fields.message.loading && filters.message ? styles.show : ''}`}
            name={fields.message.error ? 'alertIcon' : 'okIcon'}
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

export default withTranslation()(MessageFieldGroup);
