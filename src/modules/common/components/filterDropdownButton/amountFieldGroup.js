import React from 'react';
import { withTranslation } from 'react-i18next';
import { Input } from 'src/theme';
import Feedback from 'src/theme/feedback/feedback';
import styles from './filters.css';

class AmountFieldGroup extends React.Component {
  constructor() {
    super();

    this.state = {
      fields: {
        amountTo: {
          error: false,
          value: '',
          loading: false,
        },
        amountFrom: {
          error: false,
          value: '',
          loading: false,
        },
      },
      feedback: '',
    };

    this.timeout = null;

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.generateField = this.generateField.bind(this);
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
        (field === 'amountFrom' && parseFloat(value) > parseFloat(fieldsObj.amountTo.value)) ||
        (field === 'amountTo' && parseFloat(value) < parseFloat(fieldsObj.amountFrom.value))
      ) {
        feedback = t('Max amount must be greater than Min amount');
        error = true;
      }

      return {
        ...acc,
        [field]: {
          value,
          error,
          loading: false,
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

    const fieldsObj = Object.keys(filters).reduce(
      (acc, filter) => ({ ...acc, [filter]: { value: filters[filter] } }),
      {}
    );

    const fields = {
      ...fieldsObj,
      [target.name]: { value, loading: true },
    };

    this.setState({ fields });

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.validateAmountField(fields);
    }, 300);

    this.props.updateCustomFilters(fields);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  generateField({ name, placeholder }) {
    const { filters } = this.props;
    const field = this.state.fields[name];

    return (
      <label className={styles.fieldHolder}>
        <Input
          autoComplete="off"
          onChange={this.handleFieldChange}
          name={name}
          value={filters[name] ? filters[name] : ''}
          placeholder={placeholder}
          className={`${styles.input} ${field.error ? 'error' : ''} ${name}Input`}
          isLoading={field.loading}
          status={field.error ? 'error' : 'ok'}
          size="m"
        />
      </label>
    );
  }

  render() {
    const { t, label } = this.props;

    return (
      <div className={styles.fieldGroup}>
        <span className={styles.fieldLabel}>{label}</span>
        <div className={styles.fieldRow}>
          {this.generateField({ name: 'amountFrom', placeholder: t('Min') })}
          <span className={styles.separator} />
          {this.generateField({ name: 'amountTo', placeholder: t('Max') })}
        </div>
        <Feedback
          className={[styles.feedback, 'amount-feedback'].join(' ')}
          status={this.state.feedback ? 'error' : 'ok'}
          size="xs"
          message={this.state.feedback}
        />
      </div>
    );
  }
}

export default withTranslation()(AmountFieldGroup);
