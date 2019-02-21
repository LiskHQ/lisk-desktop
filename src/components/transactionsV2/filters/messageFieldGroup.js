import React from 'react';
import { translate } from 'react-i18next';
import { InputV2 } from '../../toolbox/inputsV2';
import styles from './filters.css';

class MessageFieldGroup extends React.Component {
  constructor() {
    super();

    this.state = {
      fields: {
        message: {
          error: false,
          value: '',
        },
      },
      feedback: '',
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange({ target }) {
    const { t } = this.props;
    const { fields } = this.state;
    const messageMaxLength = 64;
    const error = target.value.length > messageMaxLength;
    const feedback = error
      ? t('Maximum length exceeded')
      : '';
    const newState = {
      fields: {
        ...fields,
        [target.name]: {
          value: target.value,
          error,
        },
      },
      feedback: target.value !== '' ? feedback : '',
    };

    this.props.updateCustomFilters(newState.fields);
    this.setState(newState);
  }

  render() {
    const { handleKeyPress, t } = this.props;
    const { fields } = this.state;

    return (
      <label className={styles.fieldGroup}>
        <span className={styles.fieldLabel}>{t('Message')}</span>
        <div className={styles.fieldRow}>
          <InputV2
            autoComplete={'off'}
            onChange={this.handleFieldChange}
            name='message'
            value={fields.message.value}
            placeholder={t('Write message')}
            maxLength={100}
            onKeyDown={handleKeyPress}
            className={`${styles.input} ${fields.message.error ? 'error' : ''}`} />
        </div>
        <span className={`${styles.feedback} ${this.state.feedback ? styles.show : ''}`}>
          {this.state.feedback}
        </span>
      </label>
    );
  }
}

export default translate()(MessageFieldGroup);
