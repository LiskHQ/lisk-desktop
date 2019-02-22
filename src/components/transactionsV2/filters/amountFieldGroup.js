import React from 'react';
import { translate } from 'react-i18next';
import { InputV2 } from '../../toolbox/inputsV2';
import styles from './filters.css';

class AmountFieldGroup extends React.Component {
  constructor() {
    super();

    this.state = {
      fields: {
        amountTo: {
          error: false,
          value: '',
        },
        amountFrom: {
          error: false,
          value: '',
        },
      },
      feedback: '',
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  validateAmountField(fieldsObj) {
    const { t } = this.props;
    let feedback = '';
    const fields = Object.keys(fieldsObj).reduce((acc, field) => {
      const value = fieldsObj[field].value || '';
      let error = false;

      if (/(\.)(.*\1){1}/g.test(value) || /\.$/.test(value)) {
        feedback = t('Invalid amount');
        error = true;
      } else if (
        (field === 'amountFrom' && parseFloat(value) > parseFloat(fieldsObj.amountTo.value))
        || (field === 'amountTo' && parseFloat(value) < parseFloat(fieldsObj.amountFrom.value))
      ) {
        feedback = t('Max amount must be greater than Min amount');
        error = true;
      }

      return {
        ...acc,
        [field]: {
          ...fieldsObj[field],
          value,
          error,
        },
      };
    }, {});

    this.props.updateCustomFilters(fields);
    this.setState({ fields, feedback });
  }

  handleFieldChange({ target }) {
    const { filters } = this.props;
    let value = /^\./.test(target.value) ? `0${target.value}` : target.value;
    value = value.replace(/[^\d.]/g, '');

    const fieldsObj = Object.keys(filters).reduce((acc, filter) =>
      ({ ...acc, [filter]: { value: filters[filter] } }), {});

    this.validateAmountField({
      ...fieldsObj,
      [target.name]: { value },
    });
  }

  render() {
    const { filters, handleKeyPress, t } = this.props;
    const { fields } = this.state;

    return (
      <div className={styles.fieldGroup}>
        <span className={styles.fieldLabel}>{t('Amount')}</span>
        <div className={styles.fieldRow}>
          <InputV2
            autoComplete={'off'}
            onChange={this.handleFieldChange}
            name='amountFrom'
            value={filters.amountFrom}
            placeholder={t('Min')}
            onKeyDown={handleKeyPress}
            className={`${styles.input} ${fields.amountFrom.error ? 'error' : ''} amountFromInput`} />
          <span>-</span>
          <InputV2
            autoComplete={'off'}
            onChange={this.handleFieldChange}
            name='amountTo'
            value={filters.amountTo}
            placeholder={t('Max')}
            onKeyDown={handleKeyPress}
            className={`${styles.input} ${fields.amountTo.error ? 'error' : ''} amountToInput`} />
        </div>
        <span className={`${styles.feedback} ${this.state.feedback ? styles.show : ''}`}>
          {this.state.feedback}
        </span>
      </div>
    );
  }
}

export default translate()(AmountFieldGroup);
